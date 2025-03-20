import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SuperDashboard from '../pages/dashboards/SuperDashboard';
import RegionalDashboard from '../pages/dashboards/RegionalDashboard';
import CityDashboard from '../pages/dashboards/CityDashboard';
import LocalDashboard from '../pages/dashboards/LocalDashboard';

export default function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  // Display dashboard based on user role
  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'super_admin':
        return <SuperDashboard />;
      case 'regional_admin':
        return <RegionalDashboard />;
      case 'city_admin':
        return <CityDashboard />;
      case 'local_admin':
        return <LocalDashboard />;
      default:
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Invalid Role</h2>
            <p className="text-red-700">
              Your account has an invalid role assignment. Please contact an administrator.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}!</h2>
        <p className="text-gray-600 mb-2">
          Email: <span className="font-medium">{user.email}</span>
        </p>
        <p className="text-gray-600">
          Role: <span className="font-medium">{user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
        </p>
      </div>
      
      {renderDashboardByRole()}
    </div>
  );
}