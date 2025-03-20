import { create } from 'zustand';
import type { Vendor, VendorLevel } from '../types/vendor';
import * as vendorQueries from '../db/queries/vendors';
import { Vendor as DBVendor } from '../db/schema';

interface VendorStore {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  
  // Basic CRUD operations
  fetchVendors: () => Promise<void>;
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'status' | 'metadata'>) => Promise<void>;
  updateVendor: (updatedVendor: Vendor) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  
  // Helper methods
  getVendorById: (id: string) => Vendor | undefined;
  getVendorsByParentId: (parentId: string | null) => Vendor[];
  buildHierarchy: () => Promise<void>;
}

// Convert database vendor format to application vendor format
function dbVendorToAppVendor(dbVendor: DBVendor): Vendor {
  return {
    ...dbVendor,
    level: dbVendor.level as VendorLevel,
    parentId: dbVendor.parentId || undefined, // Convert null to undefined
    createdAt: dbVendor.createdAt.toISOString(),
    // Ensure children is always an array, even if we'll populate it later
    children: [],
  };
}

export const useVendorStore = create<VendorStore>((set, get) => ({
  vendors: [],
  loading: false,
  error: null,
  
  // Fetch all vendors and build hierarchy
  fetchVendors: async () => {
    set({ loading: true, error: null });
    try {
      const hierarchy = await vendorQueries.buildVendorHierarchy();
      set({ vendors: hierarchy, loading: false });
    } catch (error) {
      console.error('Error fetching vendors:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch vendors',
        loading: false 
      });
    }
  },
  
  // Add a new vendor
  addVendor: async (newVendor) => {
    set({ loading: true, error: null });
    try {
      const vendor = {
        ...newVendor,
        id: `V${Math.random().toString(36).substr(2, 9)}`, // Generate ID client-side
        createdAt: new Date().toISOString(),
        status: 'active',
        metadata: {
          totalDrivers: 0,
          totalVehicles: 0,
          activeVehicles: 0,
          pendingApprovals: 0
        }
      };
      
      // Convert undefined parentId to null for the database
      const dbVendor = {
        ...vendor,
        createdAt: new Date(), // Convert to Date for database
        parentId: vendor.parentId || null
      };
      
      await vendorQueries.createVendor(dbVendor);
      
      // Refresh the vendor hierarchy after adding a new vendor
      await get().buildHierarchy();
      set({ loading: false });
    } catch (error) {
      console.error('Error adding vendor:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add vendor',
        loading: false 
      });
    }
  },
  
  // Update a vendor
  updateVendor: async (updatedVendor) => {
    set({ loading: true, error: null });
    try {
      // Prepare DB updates with Date conversion
      const dbUpdates: any = { ...updatedVendor };
      
      // Don't include these fields in the DB update
      delete dbUpdates.children;
      
      // Convert undefined to null for the database
      if ('parentId' in dbUpdates) {
        dbUpdates.parentId = dbUpdates.parentId || null;
      }
      
      // Convert string date to Date object if it exists
      if (updatedVendor.createdAt) {
        dbUpdates.createdAt = new Date(updatedVendor.createdAt);
      }
      
      await vendorQueries.updateVendor(updatedVendor.id, dbUpdates);
      
      // Refresh the vendor hierarchy after updating
      await get().buildHierarchy();
      set({ loading: false });
    } catch (error) {
      console.error('Error updating vendor:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update vendor',
        loading: false 
      });
    }
  },
  
  // Delete a vendor
  deleteVendor: async (id) => {
    set({ loading: true, error: null });
    try {
      await vendorQueries.deleteVendor(id);
      
      // Refresh the vendor hierarchy after deleting
      await get().buildHierarchy();
      set({ loading: false });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete vendor',
        loading: false 
      });
    }
  },
  
  // Helper method to build vendor hierarchy
  buildHierarchy: async () => {
    set({ loading: true, error: null });
    try {
      const hierarchy = await vendorQueries.buildVendorHierarchy();
      set({ vendors: hierarchy, loading: false });
    } catch (error) {
      console.error('Error building vendor hierarchy:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to build vendor hierarchy',
        loading: false 
      });
    }
  },
  
  // Helper method to get a vendor by ID
  getVendorById: (id) => {
    // Helper function to search in the vendor tree
    const findVendor = (vendors: Vendor[], vendorId: string): Vendor | undefined => {
      for (const vendor of vendors) {
        if (vendor.id === vendorId) {
          return vendor;
        }
        if (vendor.children) {
          const found = findVendor(vendor.children, vendorId);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    return findVendor(get().vendors, id);
  },
  
  // Helper method to get vendors by parent ID
  getVendorsByParentId: (parentId) => {
    const findVendorsByParentId = (vendors: Vendor[], parentVendorId: string | null): Vendor[] => {
      return vendors.filter(v => {
        // Handle both undefined and null comparison
        if (parentVendorId === null) return !v.parentId;
        return v.parentId === parentVendorId;
      });
    };
    
    return findVendorsByParentId(get().vendors, parentId);
  }
}));