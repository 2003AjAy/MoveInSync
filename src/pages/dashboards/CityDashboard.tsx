import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Truck, Building2, AlertCircle, MapPin } from 'lucide-react';
import { useVendorStore } from '../../stores/vendorStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function CityDashboard() {
  const { user } = useAuth();
  const { vendors } = useVendorStore();

  // Only city_admin or higher can access this page
  if (!user || !['super_admin', 'regional_admin', 'city_admin'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-red-600 text-xl">Access Denied: City Admin permissions required</h1>
      </div>
    );
  }

  // In a real app, you would fetch the city data based on the user's city
  // For this example, we'll use the first city from the first region
  const superVendor = vendors[0];
  const regionalVendor = superVendor?.children?.[0];
  const cityVendor = regionalVendor?.children?.[0];

  if (!cityVendor) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-red-600 text-xl">No city data found</h1>
      </div>
    );
  }

  // Stats for this city
  const stats = [
    { 
      name: 'Total Drivers', 
      value: cityVendor.metadata?.totalDrivers || 0, 
      icon: Users 
    },
    { 
      name: 'Total Vehicles', 
      value: cityVendor.metadata?.totalVehicles || 0, 
      icon: Truck 
    },
    { 
      name: 'Local Vendors', 
      value: cityVendor.children?.length || 0, 
      icon: Building2 
    },
    { 
      name: 'Pending Approvals', 
      value: cityVendor.metadata?.pendingApprovals || 0, 
      icon: AlertCircle 
    }
  ];

  // Prepare data for vehicle status chart
  const vehicleStatusData = [
    { name: 'Active', value: cityVendor.metadata?.activeVehicles || 0 },
    { name: 'Maintenance', value: cityVendor.metadata?.maintenanceVehicles || 0 },
    { name: 'Inactive', value: (cityVendor.metadata?.totalVehicles || 0) - 
                             (cityVendor.metadata?.activeVehicles || 0) - 
                             (cityVendor.metadata?.maintenanceVehicles || 0) }
  ];

  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">City Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage {cityVendor.name} city operations
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

      {/* Vehicle Status Chart */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Vehicle Status</h2>
          <div className="bg-white rounded-lg shadow p-4" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="space-y-4">
              <button className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <span className="font-medium">Approve Driver Documents</span>
                <Users className="h-5 w-5 text-gray-400" />
              </button>
              <button className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <span className="font-medium">Schedule Vehicle Maintenance</span>
                <Truck className="h-5 w-5 text-gray-400" />
              </button>
              <button className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <span className="font-medium">Manage Local Vendors</span>
                <Building2 className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Local Vendors List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Local Vendors in {cityVendor.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage local vendors and their operations
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {cityVendor.children?.map((localVendor) => (
              <li key={localVendor.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Building2 className="h-6 w-6 text-gray-400" aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{localVendor.name}</h3>
                        <p className="text-sm text-gray-500">
                          {localVendor.metadata?.totalDrivers || 0} drivers, {localVendor.metadata?.totalVehicles || 0} vehicles
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