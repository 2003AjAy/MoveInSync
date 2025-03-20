import { db } from '../index';
import { drivers, type InsertDriver } from '../schema';
import { eq } from 'drizzle-orm';
import type { DriverDocumentStatus, DriverOnboardingStatus } from '../../types/vendor';

// Get all drivers
export async function getAllDrivers() {
  return await db.select().from(drivers);
}

// Get driver by ID
export async function getDriverById(id: string) {
  const results = await db.select().from(drivers).where(eq(drivers.id, id));
  return results[0];
}

// Get drivers by vendor ID
export async function getDriversByVendorId(vendorId: string) {
  return await db.select().from(drivers).where(eq(drivers.vendorId, vendorId));
}

// Get active drivers
export async function getActiveDrivers() {
  return await db.select().from(drivers).where(eq(drivers.status, 'active'));
}

// Get drivers with pending document verifications
export async function getDriversWithPendingVerifications() {
  // This is a complex query since documents is a JSON field
  // We'll handle the filtering in the application layer after fetching
  const allDrivers = await getAllDrivers();
  return allDrivers.filter(driver => {
    if (!driver.documents) return false;
    return Object.values(driver.documents).some(doc => doc.status === 'pending');
  });
}

// Get compliant drivers (all required documents valid)
export async function getCompliantDrivers() {
  // We'll handle the filtering in the application layer
  const allDrivers = await getAllDrivers();
  return allDrivers.filter(driver => {
    if (!driver.documents) return false;
    
    // Check if driver has required documents
    const requiredDocs = ['license', 'permit'];
    return requiredDocs.every(docType => {
      const doc = driver.documents?.[docType];
      return doc && doc.status === 'verified' && new Date(doc.expiryDate) > new Date();
    });
  });
}

// Create a new driver
export async function createDriver(driver: InsertDriver) {
  return await db.insert(drivers).values(driver).returning();
}

// Update a driver
export async function updateDriver(id: string, data: Partial<InsertDriver>) {
  return await db.update(drivers)
    .set({
      ...data,
      updatedAt: new Date()
    })
    .where(eq(drivers.id, id))
    .returning();
}

// Delete a driver
export async function deleteDriver(id: string) {
  return await db.delete(drivers).where(eq(drivers.id, id));
}

// Upload document
export async function uploadDocument(driverId: string, documentType: string, document: any) {
  const driver = await getDriverById(driverId);
  if (!driver) throw new Error('Driver not found');
  
  const updatedDocuments = {
    ...driver.documents,
    [documentType]: document
  };
  
  return await updateDriver(driverId, { 
    documents: updatedDocuments
  });
}

// Verify document
export async function verifyDocument(driverId: string, documentType: string, status: DriverDocumentStatus, comments?: string) {
  const driver = await getDriverById(driverId);
  if (!driver) throw new Error('Driver not found');
  
  if (!driver.documents || !driver.documents[documentType]) {
    throw new Error('Document not found');
  }
  
  const updatedDocument = {
    ...driver.documents[documentType],
    status,
    ...(comments && { comments })
  };
  
  const updatedDocuments = {
    ...driver.documents,
    [documentType]: updatedDocument
  };
  
  return await updateDriver(driverId, { documents: updatedDocuments });
}

// Update onboarding status
export async function updateOnboardingStatus(driverId: string, status: DriverOnboardingStatus) {
  return await updateDriver(driverId, { onboardingStatus: status });
}

// Assign vehicle
export async function assignVehicle(driverId: string, vehicleId: string) {
  return await updateDriver(driverId, { 
    vehicleId,
    status: 'active'
  });
}

// Unassign vehicle
export async function unassignVehicle(driverId: string) {
  return await updateDriver(driverId, { vehicleId: null });
}