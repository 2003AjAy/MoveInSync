import { create } from 'zustand';
import type { Vehicle, DocumentStatus } from '../types/vendor';
import * as vehicleQueries from '../db/queries/vehicles';
import { Vehicle as DBVehicle } from '../db/schema';

interface VehicleStore {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<Vehicle>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
  getVehicle: (id: string) => Vehicle | undefined;
  
  // Vehicle assignments
  assignDriver: (vehicleId: string, driverId: string) => Promise<void>;
  unassignDriver: (vehicleId: string) => Promise<void>;
  
  // Document management
  updateDocuments: (vehicleId: string, documents: Vehicle['documents']) => Promise<void>;
  verifyDocument: (vehicleId: string, documentType: keyof Vehicle['documents'], status: DocumentStatus) => Promise<void>;
  
  // Utility functions
  getVehiclesByVendor: (vendorId: string) => Vehicle[];
  getActiveVehicles: () => Vehicle[];
  getNonCompliantVehicles: () => Vehicle[];
  checkVehicleCompliance: (vehicleId: string) => boolean;
}

// Convert database vehicle format to application vehicle format
function dbVehicleToAppVehicle(dbVehicle: DBVehicle): Vehicle {
  return {
    id: dbVehicle.id,
    registrationNumber: dbVehicle.registrationNumber,
    model: dbVehicle.model,
    type: dbVehicle.type,
    seatingCapacity: dbVehicle.seatingCapacity,
    fuelType: dbVehicle.fuelType,
    vendorId: dbVehicle.vendorId,
    driverId: dbVehicle.driverId || undefined,
    status: dbVehicle.status as Vehicle['status'],
    documents: dbVehicle.documents
  };
}

// Convert application Vehicle to DB Vehicle (for inserts/updates)
function appToDBVehicle(vehicle: Partial<Vehicle>): Partial<DBVehicle> {
  const result: Partial<DBVehicle> = { ...vehicle };
  
  // Handle null vs undefined conversion
  if ('driverId' in vehicle) {
    result.driverId = vehicle.driverId || null;
  }
  
  return result;
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  loading: false,
  error: null,

  // Fetch all vehicles
  fetchVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const dbVehicles = await vehicleQueries.getAllVehicles();
      const vehicles = dbVehicles.map(dbVehicleToAppVehicle);
      set({ vehicles, loading: false });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch vehicles',
        loading: false 
      });
    }
  },

  // Add a vehicle
  addVehicle: async (vehicleData) => {
    set({ loading: true });
    try {
      const vehicleId = `V${Math.random().toString(36).substr(2, 9)}`;
      
      const newDBVehicle = {
        ...appToDBVehicle(vehicleData),
        id: vehicleId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const createdVehicles = await vehicleQueries.createVehicle(newDBVehicle);
      
      if (!createdVehicles || createdVehicles.length === 0) {
        throw new Error('Failed to create vehicle');
      }
      
      const appVehicle = dbVehicleToAppVehicle(createdVehicles[0]);
      
      // Update the local state
      set(state => ({
        vehicles: [...state.vehicles, appVehicle],
        loading: false,
      }));
      
      return appVehicle;
    } catch (error) {
      set({ error: 'Failed to add vehicle', loading: false });
      throw error;
    }
  },

  // Update a vehicle
  updateVehicle: async (id, updates) => {
    set({ loading: true });
    try {
      // Prepare the update data for the database      
      const dbUpdates = {
        ...appToDBVehicle(updates),
        updatedAt: new Date()
      };
      
      const updatedVehicles = await vehicleQueries.updateVehicle(id, dbUpdates);
      
      // If no vehicle was returned, something went wrong
      if (!updatedVehicles || updatedVehicles.length === 0) {
        throw new Error('Vehicle not found');
      }
      
      const appVehicle = dbVehicleToAppVehicle(updatedVehicles[0]);
      
      // Update the local state
      set(state => ({
        vehicles: state.vehicles.map(vehicle => {
          if (vehicle.id === id) {
            return appVehicle;
          }
          return vehicle;
        }),
        loading: false,
      }));
      
      return appVehicle;
    } catch (error) {
      set({ error: 'Failed to update vehicle', loading: false });
      throw error;
    }
  },

  // Delete a vehicle
  deleteVehicle: async (id) => {
    set({ loading: true });
    try {
      await vehicleQueries.deleteVehicle(id);
      
      // Update the local state
      set(state => ({
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete vehicle', loading: false });
      throw error;
    }
  },

  // Get a vehicle by ID
  getVehicle: (id) => {
    return get().vehicles.find(vehicle => vehicle.id === id);
  },

  // Assign a driver to a vehicle
  assignDriver: async (vehicleId, driverId) => {
    try {
      await vehicleQueries.assignDriver(vehicleId, driverId);
      
      // Refresh the vehicles list
      await get().fetchVehicles();
    } catch (error) {
      set({ error: 'Failed to assign driver' });
      throw error;
    }
  },

  // Unassign a driver from a vehicle
  unassignDriver: async (vehicleId) => {
    try {
      await vehicleQueries.unassignDriver(vehicleId);
      
      // Refresh the vehicles list
      await get().fetchVehicles();
    } catch (error) {
      set({ error: 'Failed to unassign driver' });
      throw error;
    }
  },

  // Update vehicle documents
  updateDocuments: async (vehicleId, documents) => {
    try {
      await vehicleQueries.updateDocuments(vehicleId, documents);
      
      // Refresh the vehicles list
      await get().fetchVehicles();
    } catch (error) {
      set({ error: 'Failed to update documents' });
      throw error;
    }
  },

  // Get vehicles by vendor ID
  getVehiclesByVendor: (vendorId) => {
    return get().vehicles.filter(vehicle => vehicle.vendorId === vendorId);
  },

  // Get active vehicles
  getActiveVehicles: () => {
    return get().vehicles.filter(vehicle => vehicle.status === 'active');
  },

  // Get non-compliant vehicles
  getNonCompliantVehicles: () => {
    return get().vehicles.filter(vehicle => !get().checkVehicleCompliance(vehicle.id));
  },

  // Check if a vehicle is compliant
  checkVehicleCompliance: (vehicleId) => {
    const vehicle = get().getVehicle(vehicleId);
    if (!vehicle) return false;
    
    return Object.values(vehicle.documents).every(status => status === 'valid');
  },

  // Verify a vehicle document
  verifyDocument: async (vehicleId, documentType, status) => {
    try {
      const vehicle = get().getVehicle(vehicleId);
      if (!vehicle) throw new Error('Vehicle not found');

      const updatedDocuments = {
        ...vehicle.documents,
        [documentType]: status
      };

      await get().updateDocuments(vehicleId, updatedDocuments);
    } catch (error) {
      set({ error: 'Failed to verify document' });
      throw error;
    }
  },
}));