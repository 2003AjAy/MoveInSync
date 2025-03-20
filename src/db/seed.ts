import { db } from './index';
import { vendors, drivers, vehicles } from './schema';
import { eq } from 'drizzle-orm';
import type { Permission } from '../types/vendor';

// Seed function to populate database with initial data
export async function seedDatabase() {
  console.log('🌱 Seeding database...');
  
  try {
    // Clear existing data (for clean seed)
    await db.delete(vehicles);
    await db.delete(drivers);
    await db.delete(vendors);
    
    console.log('🧹 Cleared existing data');
    
    // Insert super vendor
    const superVendors = await db.insert(vendors).values({
      id: '1',
      name: 'Super Vendor Corp',
      level: 'super',
      email: 'super@vendor.com',
      phone: '+1234567890',
      location: 'National',
      status: 'active',
      createdAt: new Date(),
      permissions: ['all'] as Permission[],
      metadata: {
        totalDrivers: 0,
        totalVehicles: 0,
        activeVehicles: 0,
        pendingApprovals: 0
      }
    }).returning();
    
    const superVendor = superVendors[0];
    console.log('👑 Created super vendor:', superVendor.name);
    
    // Insert regional vendors
    const regionalVendors = await db.insert(vendors).values([
      {
        id: '2',
        name: 'Regional Vendor East',
        level: 'regional',
        parentId: '1',
        email: 'east@vendor.com',
        phone: '+1234567891',
        location: 'East Region',
        status: 'active',
        createdAt: new Date(),
        permissions: ['manage_vendors', 'manage_drivers', 'manage_vehicles', 'view_reports'] as Permission[],
        metadata: {
          totalDrivers: 0,
          totalVehicles: 0,
          activeVehicles: 0,
          pendingApprovals: 0
        }
      },
      {
        id: '3',
        name: 'Regional Vendor North',
        level: 'regional',
        parentId: '1',
        email: 'north@vendor.com',
        phone: '+1234567892',
        location: 'North Region',
        status: 'active',
        createdAt: new Date(),
        permissions: ['manage_vendors', 'manage_drivers', 'manage_vehicles', 'view_reports'] as Permission[],
        metadata: {
          totalDrivers: 0,
          totalVehicles: 0,
          activeVehicles: 0,
          pendingApprovals: 0
        }
      }
    ]).returning();
    
    console.log(`🔷 Created ${regionalVendors.length} regional vendors`);
    
    // Insert city vendors
    const cityVendors = await db.insert(vendors).values([
      {
        id: '4',
        name: 'Mumbai City Vendor',
        level: 'city',
        parentId: '2',
        email: 'mumbai@vendor.com',
        phone: '+1234567893',
        location: 'Mumbai',
        status: 'active',
        createdAt: new Date(),
        permissions: ['manage_drivers', 'manage_vehicles', 'view_reports'] as Permission[],
        metadata: {
          totalDrivers: 0,
          totalVehicles: 0,
          activeVehicles: 0,
          pendingApprovals: 0
        }
      },
      {
        id: '5',
        name: 'Delhi City Vendor',
        level: 'city',
        parentId: '3',
        email: 'delhi@vendor.com',
        phone: '+1234567894',
        location: 'Delhi',
        status: 'active',
        createdAt: new Date(),
        permissions: ['manage_drivers', 'manage_vehicles', 'view_reports'] as Permission[],
        metadata: {
          totalDrivers: 0,
          totalVehicles: 0,
          activeVehicles: 0,
          pendingApprovals: 0
        }
      }
    ]).returning();
    
    console.log(`🏙️ Created ${cityVendors.length} city vendors`);
    
    // Insert local vendors
    const localVendors = await db.insert(vendors).values([
      {
        id: '6',
        name: 'Mumbai Local Vendor 1',
        level: 'local',
        parentId: '4',
        email: 'mumbai.local1@vendor.com',
        phone: '+1234567895',
        location: 'Mumbai North',
        status: 'active',
        createdAt: new Date(),
        permissions: ['manage_drivers', 'view_reports'] as Permission[],
        metadata: {
          totalDrivers: 0,
          totalVehicles: 0,
          activeVehicles: 0,
          pendingApprovals: 0
        }
      },
      {
        id: '7',
        name: 'Delhi Local Vendor 1',
        level: 'local',
        parentId: '5',
        email: 'delhi.local1@vendor.com',
        phone: '+1234567896',
        location: 'Delhi Central',
        status: 'active',
        createdAt: new Date(),
        permissions: ['manage_drivers', 'view_reports'] as Permission[],
        metadata: {
          totalDrivers: 0,
          totalVehicles: 0,
          activeVehicles: 0,
          pendingApprovals: 0
        }
      }
    ]).returning();
    
    console.log(`🏠 Created ${localVendors.length} local vendors`);
    
    // Insert drivers
    const insertedDrivers = await db.insert(drivers).values([
      {
        id: 'D1',
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        address: '123 Main St, Mumbai',
        licenseNumber: 'DL123456',
        vendorId: '6',
        vehicleId: null, // Will be updated after vehicle creation
        status: 'active',
        onboardingStatus: 'completed',
        documents: {
          license: {
            id: 'doc1',
            type: 'license',
            number: 'DL123456',
            expiryDate: '2025-12-31',
            issuedDate: '2020-01-01',
            status: 'verified',
            fileUrl: 'https://example.com/license.pdf',
          },
          permit: {
            id: 'doc2',
            type: 'permit',
            number: 'P123',
            expiryDate: '2024-12-31',
            issuedDate: '2023-01-01',
            status: 'verified',
            fileUrl: 'https://example.com/permit.pdf',
          }
        },
        metadata: {
          totalTrips: 150,
          rating: 4.8,
          lastActive: new Date().toISOString(),
          completedVerification: true,
        },
        bankDetails: {
          accountNumber: '1234567890',
          bankName: 'HDFC Bank',
          ifscCode: 'HDFC0001234',
          accountHolderName: 'John Doe',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'D2',
        name: 'Raj Kumar',
        phone: '+1234567891',
        email: 'raj@example.com',
        address: '456 Park Road, Delhi',
        licenseNumber: 'DL654321',
        vendorId: '7',
        vehicleId: null,
        status: 'inactive',
        onboardingStatus: 'pending',
        documents: {
          license: {
            id: 'doc3',
            type: 'license',
            number: 'DL654321',
            expiryDate: '2025-10-31',
            issuedDate: '2020-10-01',
            status: 'pending',
            fileUrl: 'https://example.com/license2.pdf',
          }
        },
        metadata: {
          totalTrips: 0,
          rating: 0,
          completedVerification: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]).returning();
    
    console.log(`🧑‍✈️ Created ${insertedDrivers.length} drivers`);
    
    // Insert vehicles
    const insertedVehicles = await db.insert(vehicles).values([
      {
        id: 'V1',
        registrationNumber: 'MH01AB1234',
        model: 'Toyota Camry',
        type: 'Sedan',
        seatingCapacity: 4,
        fuelType: 'Petrol',
        vendorId: '6',
        driverId: 'D1',
        status: 'active',
        documents: {
          registration: 'valid',
          insurance: 'valid',
          permit: 'valid',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'V2',
        registrationNumber: 'DL01CD5678',
        model: 'Maruti Swift',
        type: 'Hatchback',
        seatingCapacity: 4,
        fuelType: 'CNG',
        vendorId: '7',
        driverId: null,
        status: 'inactive',
        documents: {
          registration: 'valid',
          insurance: 'expired',
          permit: 'valid',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]).returning();
    
    console.log(`🚗 Created ${insertedVehicles.length} vehicles`);
    
    // Update vendor metadata
    await db.update(vendors)
      .set({ 
        metadata: {
          totalDrivers: 1,
          totalVehicles: 1,
          activeVehicles: 1,
          pendingApprovals: 0
        }
      })
      .where(eq(vendors.id, '6'));
      
    await db.update(vendors)
      .set({ 
        metadata: {
          totalDrivers: 1,
          totalVehicles: 1,
          activeVehicles: 0,
          pendingApprovals: 1
        }
      })
      .where(eq(vendors.id, '7'));
    
    console.log('📊 Updated vendor metadata');
    console.log('✅ Database seeding completed successfully');
    
    return {
      vendors: [superVendor, ...regionalVendors, ...cityVendors, ...localVendors],
      drivers: insertedDrivers,
      vehicles: insertedVehicles
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Only run seeding if this file is executed directly with node/tsx
if (process.argv[1] === import.meta.url.substring(7)) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to seed database:', error);
      process.exit(1);
    });
}