import { db } from '../index';
import { vehicles, type InsertVehicle } from '../schema';
import { eq } from 'drizzle-orm';
import type { DocumentStatus } from '../../types/vendor';

// Get all vehicles
export async function getAllVehicles() {
  return await db.select().from(vehicles);
}

// Get vehicle by ID
export async function getVehicleById(id: string) {
  const results = await db.select().from(vehicles).where(eq(vehicles.id, id));
  return results[0];
}

// Get vehicles by vendor ID
export async function getVehiclesByVendorId(vendorId: string) {
  return await db.select().from(vehicles).where(eq(vehicles.vendorId, vendorId));
}

// Get active vehicles
export async function getActiveVehicles() {
  return await db.select().from(vehicles).where(eq(vehicles.status, 'active'));
}

// Get non-compliant vehicles
export async function getNonCompliantVehicles() {
  // We'll handle complex document filtering in the application layer
  const allVehicles = await getAllVehicles();
  return allVehicles.filter(vehicle => {
    if (!vehicle.documents) return true; // No documents means non-compliant
    
    // Check if all documents are valid
    return Object.values(vehicle.documents).some(status => status !== 'valid');
  });
}

// Create a new vehicle
export async function createVehicle(vehicle: InsertVehicle) {
  return await db.insert(vehicles).values(vehicle).returning();
}

// Update a vehicle
export async function updateVehicle(id: string, data: Partial<InsertVehicle>) {
  return await db.update(vehicles)
    .set({
      ...data,
      updatedAt: new Date()
    })
    .where(eq(vehicles.id, id))
    .returning();
}

// Delete a vehicle
export async function deleteVehicle(id: string) {
  return await db.delete(vehicles).where(eq(vehicles.id, id));
}

// Check vehicle compliance
export async function checkVehicleCompliance(vehicleId: string): Promise<boolean> {
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) return false;
  
  // Check if all documents are valid
  return Object.values(vehicle.documents).every(status => status === 'valid');
}

// Verify document
export async function verifyDocument(vehicleId: string, documentType: string, status: DocumentStatus) {
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) throw new Error('Vehicle not found');
  
  const updatedDocuments = {
    ...vehicle.documents,
    [documentType]: status
  };
  
  return await updateVehicle(vehicleId, { documents: updatedDocuments });
}

// Assign driver
export async function assignDriver(vehicleId: string, driverId: string) {
  return await updateVehicle(vehicleId, { driverId });
}

// Unassign driver
export async function unassignDriver(vehicleId: string) {
  return await updateVehicle(vehicleId, { driverId: null });
}

// Update documents
export async function updateDocuments(vehicleId: string, documents: {
  registration: DocumentStatus;
  insurance: DocumentStatus;
  permit: DocumentStatus;
}) {
  return await updateVehicle(vehicleId, { documents });
}