import { create } from 'zustand';
import type { Vendor } from '../types/vendor';
import * as vendorQueries from '../db/queries/vendors';

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
      set({ error: 'Failed to fetch vendors', loading: false });
    }
  },
  
  // Add a new vendor
  addVendor: async (newVendor) => {
    set({ loading: true, error: null });
    try {
      // Add the vendor to the database
      const addedVendor = await vendorQueries.createVendor({
        ...newVendor,
        id: crypto.randomUUID(), // Generate an ID for the new vendor
        status: 'active',
        metadata: {},
        createdAt: new Date()
      });
      
      if (!addedVendor || !addedVendor[0]) {
        throw new Error('Failed to add vendor');
      }
      
      // Update the local state
      const { vendors } = get();
      
      // If this is a child vendor, add it to its parent's children
      if (newVendor.parentId) {
        const updatedVendors = [...vendors];
        const addToParent = (vendors: Vendor[], parentId: string, newVendor: Vendor) => {
          for (let i = 0; i < vendors.length; i++) {
            if (vendors[i].id === parentId) {
              // Initialize children array if it doesn't exist
              if (!vendors[i].children) {
                vendors[i].children = [];
              }
              // Now TypeScript knows children is defined
              vendors[i].children!.push(newVendor);
              return true;
            }
            // Check if children exist and has length before recursive call
            if ((vendors[i].children || []).length > 0) {
              if (addToParent(vendors[i].children!, parentId, newVendor)) {
                return true;
              }
            }
            
          }
          return false;
        };
        
        // Cast the added vendor to the correct type
        const vendorToAdd = addedVendor[0] as unknown as Vendor;
        addToParent(updatedVendors, newVendor.parentId, vendorToAdd);
        set({ vendors: updatedVendors, loading: false });
      } else {
        // If it's a top-level vendor, add it to the root
        set({ vendors: [...vendors, addedVendor[0] as unknown as Vendor], loading: false });
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      set({ error: 'Failed to add vendor', loading: false });
    }
  },
  
  // Update a vendor
  updateVendor: async (updatedVendor) => {
    set({ loading: true, error: null });
    try {
      // Convert string date to Date object for the database
      const vendorForDb = {
        ...updatedVendor,
        createdAt: updatedVendor.createdAt ? new Date(updatedVendor.createdAt) : undefined
      };
      
      // Update the vendor in the database - pass only the id and the data separately
      const result = await vendorQueries.updateVendor(updatedVendor.id, vendorForDb);
      
      if (!result || !result[0]) {
        throw new Error('Failed to update vendor');
      }
      
      // Update the local state
      const { vendors } = get();
      const updatedVendors = [...vendors];
      
      const updateInTree = (vendors: Vendor[], updatedVendor: Vendor): boolean => {
        for (let i = 0; i < vendors.length; i++) {
          if (vendors[i].id === updatedVendor.id) {
            // Keep the children if they exist
            const children = vendors[i].children || [];
            vendors[i] = { ...updatedVendor, children };
            return true;
          }
          
          // If this vendor has children, recursively update them
          if (vendors[i].children && vendors[i].children.length > 0) {
            // Use non-null assertion since we've checked for existence
            if (updateInTree(vendors[i].children!, updatedVendor)) {
              return true;
            }
          }
        }
        return false;
      };
      
      updateInTree(updatedVendors, result[0] as unknown as Vendor);
      set({ vendors: updatedVendors, loading: false });
    } catch (error) {
      console.error('Error updating vendor:', error);
      set({ error: 'Failed to update vendor', loading: false });
    }
  },
  
  // Delete a vendor
  deleteVendor: async (id) => {
    set({ loading: true, error: null });
    try {
      // Delete the vendor from the database
      await vendorQueries.deleteVendor(id);
      
      // Update the local state
      const { vendors } = get();
      const updatedVendors = [...vendors];
      
      // Find and remove the vendor from the hierarchy
      const removeFromTree = (vendors: Vendor[], id: string): boolean => {
        for (let i = 0; i < vendors.length; i++) {
          if (vendors[i].id === id) {
            vendors.splice(i, 1);
            return true;
          }
          
          // If this vendor has children, recursively check them
          if (vendors[i].children && vendors[i].children.length > 0) {
            // Use non-null assertion since we've checked for existence
            if (removeFromTree(vendors[i].children!, id)) {
              return true;
            }
          }
        }
        return false;
      };
      
      removeFromTree(updatedVendors, id);
      set({ vendors: updatedVendors, loading: false });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      set({ error: 'Failed to delete vendor', loading: false });
    }
  },
  
  // Helper method to build vendor hierarchy
  buildHierarchy: async () => {
    set({ loading: true, error: null });
    try {
      const hierarchy = await vendorQueries.buildVendorHierarchy();
      set({ vendors: hierarchy, loading: false });
    } catch (error) {
      console.error('Error building hierarchy:', error);
      set({ error: 'Failed to build vendor hierarchy', loading: false });
    }
  },
  
  // Helper method to get a vendor by ID
  getVendorById: (id) => {
    const { vendors } = get();
    
    // Helper function to find a vendor recursively
    const findVendor = (vendors: Vendor[], id: string): Vendor | undefined => {
      for (const vendor of vendors) {
        if (vendor.id === id) {
          return vendor;
        }
        // If the vendor has children, search through them
        if (vendor.children && vendor.children.length > 0) {
          const found = findVendor(vendor.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    return findVendor(vendors, id);
  },
  
  // Helper method to get vendors by parent ID
  getVendorsByParentId: (parentId) => {
    const { vendors } = get();
    
    if (parentId === null) {
      // Return top-level vendors
      return vendors.filter(v => !v.parentId);
    }
    
    // Helper function to find children of a vendor
    const findChildren = (vendors: Vendor[], parentId: string): Vendor[] => {
      for (const vendor of vendors) {
        if (vendor.id === parentId) {
          return vendor.children || [];
        }
        
        // If the vendor has children, search through them
        if (vendor.children && vendor.children.length > 0) {
          const found = findChildren(vendor.children, parentId);
          if (found.length > 0) return found;
        }
      }
      return [];
    };
    
    return findChildren(vendors, parentId);
  }
}));