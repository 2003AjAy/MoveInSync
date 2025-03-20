import { db } from '../index';
import { vendors, type InsertVendor } from '../schema';
import { eq, isNull } from 'drizzle-orm';
import type { Vendor as VendorType } from '../../types/vendor'; 

// Get all vendors
export async function getAllVendors() {
  return await db.select().from(vendors);
}

// Get vendor by ID
export async function getVendorById(id: string) {
  const results = await db.select().from(vendors).where(eq(vendors.id, id));
  return results[0];
}

// Get vendors by parent ID
export async function getVendorsByParentId(parentId: string | null) {
  if (parentId === null) {
    return await db.select().from(vendors).where(isNull(vendors.parentId));
  }
  return await db.select().from(vendors).where(eq(vendors.parentId, parentId));
}

// Create a new vendor
export async function createVendor(vendor: InsertVendor) {
  return await db.insert(vendors).values(vendor).returning();
}

// Update a vendor
export async function updateVendor(id: string, data: Partial<InsertVendor>) {
  return await db.update(vendors).set(data).where(eq(vendors.id, id)).returning();
}

// Delete a vendor
export async function deleteVendor(id: string) {
  return await db.delete(vendors).where(eq(vendors.id, id));
}

// Build vendor hierarchy
export async function buildVendorHierarchy(): Promise<VendorType[]> {
  // Get all vendors
  const allVendors = await getAllVendors();
  
  // Convert DB format to app format with children array and handle null vs undefined
  const vendorsWithChildren = allVendors.map(dbVendor => ({
    ...dbVendor,
    level: dbVendor.level as VendorType['level'], // Cast string to enum
    parentId: dbVendor.parentId || undefined, // Convert null to undefined
    createdAt: dbVendor.createdAt.toISOString(),
    children: []
  })) as VendorType[];
  
  // Create a map for quick access
  const vendorMap = new Map<string, VendorType>(
    vendorsWithChildren.map(vendor => [vendor.id, vendor])
  );
  
  // Root vendors (super vendors)
  const rootVendors: VendorType[] = [];
  
  // Build the hierarchy
  vendorsWithChildren.forEach(vendor => {
    if (!vendor.parentId) {
      rootVendors.push(vendor);
    } else {
      const parentVendor = vendorMap.get(vendor.parentId);
      if (parentVendor && parentVendor.children) {
        parentVendor.children.push(vendor);
      }
    }
  });
  
  return rootVendors;
}