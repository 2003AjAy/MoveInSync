import { useAuth } from '../../contexts/AuthContext';
import { Users, Truck, Clock, AlertCircle, Calendar } from 'lucide-react';
import { useVendorStore } from '../../stores/vendorStore';

export default function LocalDashboard() {
  const { user } = useAuth();
  const { vendors } = useVendorStore();

  // All roles can access the local dashboard
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-red-600 text-xl">Access Denied: Please log in</h1>
      </div>
    );
  }

  // In a real app, you would fetch the local vendor data based on the user's assigned vendor
  // For this example, we'll use the first local vendor from the first city in the first region
  const superVendor = vendors[0];
  const regionalVendor = superVendor?.children?.[0];
  const cityVendor = regionalVendor?.children?.[0];
  const localVendor = cityVendor?.children?.[0];

  if (!localVendor) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-red-600 text-xl">No local vendor data found</h1>
      </div>
    );
  }

  // Stats for this local vendor
  const stats = [
    { 
      name: 'Total Drivers', 
      value: localVendor.metadata?.totalDrivers || 0, 
      icon: Users 
    },
    { 
      name: 'Total Vehicles', 
      value: localVendor.metadata?.totalVehicles || 0, 
      icon: Truck 
    },
    { 
      name: 'Active Trips', 
      // Use a custom property or default to 0
      value: 0, 
      icon: Clock 
    },
    { 
      name: 'Pending Approvals', 
      value: localVendor.metadata?.pendingApprovals || 0, 
      icon: AlertCircle 
    }
  ];

  // Sample driver data
  const drivers = [
    { id: 1, name: 'Rahul Sharma', status: 'On Trip', vehicle: 'DL01AB1234', trips: 8 },
    { id: 2, name: 'Priya Singh', status: 'Available', vehicle: 'DL01CD5678', trips: 5 },
    { id: 3, name: 'Amit Kumar', status: 'Off Duty', vehicle: 'DL01EF9012', trips: 0 },
    { id: 4, name: 'Neha Gupta', status: 'On Trip', vehicle: 'DL01GH3456', trips: 6 }
  ];

  // Sample upcoming schedule
  const schedule = [
    { id: 1, title: 'Driver Training', time: '10:00 AM', date: 'Tomorrow' },
    { id: 2, title: 'Vehicle Inspection', time: '2:00 PM', date: 'Today' },
    { id: 3, title: 'Document Renewal', time: '11:30 AM', date: 'Next Week' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Local Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage {localVendor.name} operations
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Driver Status */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Driver Status</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trips Today
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {drivers.map((driver) => (
                    <tr key={driver.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          driver.status === 'On Trip' ? 'bg-green-100 text-green-800' :
                          driver.status === 'Available' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.vehicle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.trips}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">Details</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Schedule</h2>
          <div className="bg-white rounded-lg shadow">
            <ul className="divide-y divide-gray-200">
              {schedule.map((item) => (
                <li key={item.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {item.time} - {item.date}
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 p-4">
              <button
                type="button"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View All Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}