import { create } from 'zustand';
import type { Driver, DriverDocument, DriverDocumentStatus, DriverOnboardingStatus, DriverDocumentType } from '../types/vendor';
import * as driverQueries from '../db/queries/drivers';
import { Driver as DBDriver } from '../db/schema';

interface DriverStore {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
  
  // Core CRUD operations
  fetchDrivers: () => Promise<void>;
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'onboardingStatus' | 'documents'>) => Promise<Driver>;
  updateDriver: (id: string, updates: Partial<Driver>) => Promise<Driver>;
  deleteDriver: (id: string) => Promise<void>;
  getDriver: (id: string) => Driver | undefined;
  
  // Document management
  uploadDocument: (driverId: string, document: Omit<DriverDocument, 'id'>) => Promise<void>;
  verifyDocument: (driverId: string, documentType: string, status: DriverDocumentStatus, comments?: string) => Promise<void>;
  
  // Fleet management
  assignVehicle: (driverId: string, vehicleId: string) => Promise<void>;
  unassignVehicle: (driverId: string) => Promise<void>;
  
  // Onboarding workflow
  updateOnboardingStatus: (driverId: string, status: DriverOnboardingStatus) => Promise<void>;
  
  // Utility functions
  getDriversByVendor: (vendorId: string) => Driver[];
  getActiveDrivers: () => Driver[];
  getPendingVerifications: () => Driver[];
  getCompliantDrivers: () => Driver[];
  getExpiringDocuments: (daysThreshold?: number) => Driver[];
}

// Helper functions for document validation
const isDocumentValid = (document: DriverDocument): boolean => {
  if (!document) return false;
  if (document.status !== 'verified') return false;
  
  const expiryDate = new Date(document.expiryDate);
  const today = new Date();
  return expiryDate > today;
};

const isDriverCompliant = (driver: Driver): boolean => {
  const requiredDocuments = ['license', 'permit'];
  return requiredDocuments.every(docType => {
    const doc = driver.documents[docType];
    return doc && isDocumentValid(doc);
  });
};

// Convert database driver format to application driver format
function dbDriverToAppDriver(dbDriver: DBDriver): Driver {
  return {
    ...dbDriver,
    email: dbDriver.email || undefined,
    address: dbDriver.address || undefined,
    vehicleId: dbDriver.vehicleId || undefined,
    status: dbDriver.status as Driver['status'],
    onboardingStatus: dbDriver.onboardingStatus as DriverOnboardingStatus,
    documents: convertDocuments(dbDriver.documents || {}),
    metadata: dbDriver.metadata || {},
    bankDetails: dbDriver.bankDetails || undefined,
    createdAt: dbDriver.createdAt.toISOString(),
    updatedAt: dbDriver.updatedAt.toISOString(),
  };
}

// Helper function to ensure document types are correctly typed
function convertDocuments(documents: Record<string, any>): Record<string, DriverDocument> {
  const result: Record<string, DriverDocument> = {};
  
  for (const [key, doc] of Object.entries(documents)) {
    result[key] = {
      ...doc,
      type: doc.type as DriverDocumentType
    };
  }
  
  return result;
}

export const useDriverStore = create<DriverStore>((set, get) => ({
  drivers: [],
  loading: false,
  error: null,

  // Fetch all drivers
  fetchDrivers: async () => {
    set({ loading: true, error: null });
    try {
      const dbDrivers = await driverQueries.getAllDrivers();
      const drivers = dbDrivers.map(dbDriverToAppDriver);
      set({ drivers, loading: false });
    } catch (error) {
      console.error('Error fetching drivers:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch drivers',
        loading: false 
      });
    }
  },

  // Add a new driver
  addDriver: async (driverData) => {
    set({ loading: true, error: null });
    try {
      // Validate required fields
      if (!driverData.phone || !driverData.licenseNumber) {
        throw new Error('Phone and license number are required');
      }

      // Check for duplicate license number
      const existingDriver = get().drivers.find(
        d => d.licenseNumber === driverData.licenseNumber
      );
      
      if (existingDriver) {
        throw new Error('Driver with this license number already exists');
      }

      // Generate a unique ID for the new driver
      const uniqueId = `D${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
      
      const newDriver = {
        ...driverData,
        id: uniqueId,
        status: 'inactive' as const,
        onboardingStatus: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: {},
        metadata: {
          totalTrips: 0,
          rating: 0,
          completedVerification: false,
        },
      };
      
      console.log('Creating driver with data:', {
        ...newDriver,
        createdAt: new Date(),
        updatedAt: new Date(),
        email: newDriver.email || null,
        address: newDriver.address || null,
        vehicleId: newDriver.vehicleId || null,
        documents: {},
      });
      
      try {
        const createdDrivers = await driverQueries.createDriver({
          ...newDriver,
          createdAt: new Date(),
          updatedAt: new Date(),
          email: newDriver.email || null,
          address: newDriver.address || null,
          vehicleId: newDriver.vehicleId || null,
          documents: {},
        });
        
        if (!createdDrivers || createdDrivers.length === 0) {
          throw new Error('Failed to create driver: No driver returned from database');
        }
        
        const appDriver = dbDriverToAppDriver(createdDrivers[0]);
        
        set(state => ({
          drivers: [...state.drivers, appDriver],
          loading: false,
        }));
        
        return appDriver;
      } catch (error) {
        console.error('Error in database operation:', error);
        
        // Handle foreign key constraint violation
        if (error instanceof Error && error.message.includes('violates foreign key constraint')) {
          throw new Error(`Invalid vendor ID: The specified vendor does not exist. Please select a valid vendor.`);
        }
        
        // Handle other specific error types
        if (error instanceof Error && error.message.includes('Vendor with ID')) {
          throw error; // Pass through the specific vendor error
        }
        
        // Re-throw the original error
        throw error;
      }
    } catch (error) {
      console.error('Error creating driver:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add driver', loading: false });
      throw error;
    }
  },

  // Update a driver
  updateDriver: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const driver = get().getDriver(id);
      if (!driver) throw new Error('Driver not found');

      // Validate license number if being updated
      if (updates.licenseNumber && updates.licenseNumber !== driver.licenseNumber) {
        const existingDriver = get().drivers.find(
          d => d.licenseNumber === updates.licenseNumber
        );
        if (existingDriver) {
          throw new Error('Driver with this license number already exists');
        }
      }
      
      // Prepare the update data for the database
      const dbUpdates: any = { ...updates };
      
      // Convert date strings to Date objects
      if (updates.createdAt) dbUpdates.createdAt = new Date(updates.createdAt);
      if (updates.updatedAt) dbUpdates.updatedAt = new Date(updates.updatedAt);
      
      // Convert undefined to null for the database
      if ('email' in updates) dbUpdates.email = updates.email || null;
      if ('address' in updates) dbUpdates.address = updates.address || null;
      if ('vehicleId' in updates) dbUpdates.vehicleId = updates.vehicleId || null;

      // Update the driver in the database
      const updatedDrivers = await driverQueries.updateDriver(id, dbUpdates);
      
      // If no driver was returned, something went wrong
      if (!updatedDrivers || updatedDrivers.length === 0) {
        throw new Error('Driver not found');
      }
      
      const appDriver = dbDriverToAppDriver(updatedDrivers[0]);

      // Update the local state
      set(state => ({
        drivers: state.drivers.map(d => d.id === id ? appDriver : d),
        loading: false,
      }));
      
      return appDriver;
    } catch (error) {
      console.error('Error updating driver:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update driver', loading: false });
      throw error;
    }
  },

  // Delete a driver
  deleteDriver: async (id) => {
    set({ loading: true, error: null });
    try {
      await driverQueries.deleteDriver(id);
      
      // Update the local state
      set(state => ({
        drivers: state.drivers.filter(d => d.id !== id),
        loading: false,
      }));
    } catch (error) {
      console.error('Error deleting driver:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete driver', loading: false });
      throw error;
    }
  },

  // Get a driver by ID
  getDriver: (id) => {
    return get().drivers.find(d => d.id === id);
  },

  // Upload document for a driver
  uploadDocument: async (driverId, document) => {
    set({ loading: true, error: null });
    try {
      const driver = get().getDriver(driverId);
      if (!driver) throw new Error('Driver not found');

      const documentId = `DOC${Math.random().toString(36).substr(2, 9)}`;
      
      const newDocument = {
        ...document,
        id: documentId,
        status: 'pending' as DriverDocumentStatus,
      };
      
      // Update the driver document in the database
      await driverQueries.uploadDocument(driverId, document.type, newDocument);
      
      // Refresh drivers after upload
      await get().fetchDrivers();
      set({ loading: false });
    } catch (error) {
      console.error('Error uploading document:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to upload document', loading: false });
      throw error;
    }
  },

  // Verify a document
  verifyDocument: async (driverId, documentType, status, comments) => {
    set({ loading: true, error: null });
    try {
      await driverQueries.verifyDocument(driverId, documentType, status, comments);
      
      // Refresh drivers after verification
      await get().fetchDrivers();
      set({ loading: false });
    } catch (error) {
      console.error('Error verifying document:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to verify document', loading: false });
      throw error;
    }
  },

  // Assign a vehicle to a driver
  assignVehicle: async (driverId, vehicleId) => {
    set({ loading: true, error: null });
    try {
      const driver = get().getDriver(driverId);
      if (!driver) throw new Error('Driver not found');

      if (!isDriverCompliant(driver)) {
        throw new Error('Driver documents are not compliant');
      }

      if (driver.vehicleId) {
        throw new Error('Driver already assigned to a vehicle');
      }

      await driverQueries.assignVehicle(driverId, vehicleId);
      
      // Refresh drivers after assignment
      await get().fetchDrivers();
      set({ loading: false });
    } catch (error) {
      console.error('Error assigning vehicle:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to assign vehicle', loading: false });
      throw error;
    }
  },

  // Unassign a vehicle from a driver
  unassignVehicle: async (driverId) => {
    set({ loading: true, error: null });
    try {
      await driverQueries.unassignVehicle(driverId);
      
      // Refresh drivers after unassignment
      await get().fetchDrivers();
      set({ loading: false });
    } catch (error) {
      console.error('Error unassigning vehicle:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to unassign vehicle', loading: false });
      throw error;
    }
  },

  // Update onboarding status
  updateOnboardingStatus: async (driverId, status) => {
    set({ loading: true, error: null });
    try {
      await driverQueries.updateOnboardingStatus(driverId, status);
      
      // Refresh drivers after status update
      await get().fetchDrivers();
      set({ loading: false });
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update onboarding status', loading: false });
      throw error;
    }
  },

  // Get drivers by vendor ID
  getDriversByVendor: (vendorId) => {
    return get().drivers.filter(driver => driver.vendorId === vendorId);
  },

  // Get active drivers
  getActiveDrivers: () => {
    return get().drivers.filter(driver => driver.status === 'active');
  },

  // Get drivers with pending verifications
  getPendingVerifications: () => {
    return get().drivers.filter(driver => 
      Object.values(driver.documents).some(doc => doc.status === 'pending')
    );
  },

  // Get compliant drivers
  getCompliantDrivers: () => {
    return get().drivers.filter(isDriverCompliant);
  },

  // Get drivers with expiring documents
  getExpiringDocuments: (daysThreshold = 30) => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysThreshold);

    return get().drivers.filter(driver => 
      Object.values(driver.documents).some(doc => {
        const expiryDate = new Date(doc.expiryDate);
        return expiryDate <= threshold && doc.status === 'verified';
      })
    );
  },
}));