import { 
  pgTable, 
  text, 
  timestamp, 
  integer,
  json
} from 'drizzle-orm/pg-core';

// Vendor table
export const vendors = pgTable('vendors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  level: text('level').notNull(), // 'super', 'regional', 'city', 'local'
  parentId: text('parent_id'),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  location: text('location').notNull(),
  status: text('status').notNull().default('active'), // 'active', 'inactive'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  permissions: json('permissions').$type<string[]>().notNull(),
  metadata: json('metadata').$type<{
    totalDrivers?: number;
    totalVehicles?: number;
    activeVehicles?: number;
    pendingApprovals?: number;
  }>(),
});

// Driver table
export const drivers = pgTable('drivers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  licenseNumber: text('license_number').notNull(),
  vendorId: text('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  vehicleId: text('vehicle_id'),
  status: text('status').notNull().default('inactive'), // 'active', 'inactive', 'suspended'
  onboardingStatus: text('onboarding_status').notNull().default('pending'), // 'pending', 'in_progress', 'completed', 'rejected'
  documents: json('documents').$type<Record<string, {
    id: string;
    type: string;
    number: string;
    expiryDate: string;
    issuedDate: string;
    status: string; // 'pending', 'verified', 'rejected', 'expired'
    fileUrl: string;
    comments?: string;
  }>>().default({}),
  metadata: json('metadata').$type<{
    totalTrips?: number;
    rating?: number;
    lastActive?: string;
    completedVerification?: boolean;
  }>(),
  bankDetails: json('bank_details').$type<{
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Vehicle table
export const vehicles = pgTable('vehicles', {
  id: text('id').primaryKey(),
  registrationNumber: text('registration_number').notNull().unique(),
  model: text('model').notNull(),
  type: text('type').notNull(),
  seatingCapacity: integer('seating_capacity').notNull(),
  fuelType: text('fuel_type').notNull(),
  vendorId: text('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  driverId: text('driver_id').references(() => drivers.id),
  status: text('status').notNull().default('inactive'), // 'active', 'inactive', 'suspended'
  documents: json('documents').$type<{
    registration: string; // 'valid', 'expired', 'pending', 'rejected'
    insurance: string;
    permit: string;
  }>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Define inferred types
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;

export type Driver = typeof drivers.$inferSelect; 
export type InsertDriver = typeof drivers.$inferInsert;

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;
