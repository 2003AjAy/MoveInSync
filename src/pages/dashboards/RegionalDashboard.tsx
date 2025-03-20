import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Truck, MapPin, AlertCircle } from 'lucide-react';
import { useVendorStore } from '../../stores/vendorStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RegionalDashboard() {
  const { user } = useAuth();
  const { vendors } = useVendorStore();

  // Only regional_admin or higher can access this page
  if (!user || !['super_admin', 'regional_admin'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-red-600 text-xl">Access Denied: Regional Admin permissions required</h1>
      </div>
    );
  }

  // In a real app, you would fetch the regional data based on the user's region
  // For this example, we'll use the first region from the vendors data
  const superVendor = vendors[0];
  const regionalVendor = superVendor?.children?.[0];

  if (!regionalVendor) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-red-600 text-xl">No regional data found</h1>
      </div>
    );
  }

  // Stats for this region
  const stats = [
    { 
      name: 'Total Drivers', 
      value: regionalVendor.metadata?.totalDrivers || 0, 
      icon: Users 
    },
    { 
      name: 'Total Vehicles', 
      value: regionalVendor.metadata?.totalVehicles || 0, 
      icon: Truck 
    },
    { 
      name: 'Cities', 
      value: regionalVendor.children?.length || 0, 
      icon: MapPin 
    },
    { 
      name: 'Pending Approvals', 
      value: regionalVendor.metadata?.pendingApprovals || 0, 
      icon: AlertCircle 
    }
  ];

  // Prepare data for city performance chart
  const cityData = regionalVendor.children?.map(city => ({
    name: city.name,
    drivers: city.metadata?.totalDrivers || 0,
    vehicles: city.metadata?.totalVehicles || 0,
    activeVehicles: city.metadata?.activeVehicles || 0,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Regional Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage {regionalVendor.name} region and its cities
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-600 p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* City Performance Chart */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">City Performance</h2>
        <div className="bg-white rounded-lg shadow p-4" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="drivers" fill="#8884d8" name="Total Drivers" />
              <Bar dataKey="vehicles" fill="#82ca9d" name="Total Vehicles" />
              <Bar dataKey="activeVehicles" fill="#ffc658" name="Active Vehicles" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cities List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Cities in {regionalVendor.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage cities and their local vendors
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {regionalVendor.children?.map((city) => (
              <li key={city.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MapPin className="h-6 w-6 text-gray-400" aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{city.name}</h3>
                        <p className="text-sm text-gray-500">
                          {city.metadata?.totalDrivers || 0} drivers, {city.metadata?.totalVehicles || 0} vehicles
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}