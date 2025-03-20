import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import RoleBasedDashboard from './components/RoleBasedDashboard';
import VendorList from './pages/VendorList';
import DriverList from './pages/DriverList';
import VehicleList from './pages/VehicleList';
import OrgChart from './components/OrgChart';
import LoadingScreen from './components/LoadingScreen';

// Import stores
import { useVendorStore } from './stores/vendorStore';
import { useDriverStore } from './stores/driverStore';
import { useVehicleStore } from './stores/vehicleStore';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get store actions
  const { fetchVendors } = useVendorStore();
  const { fetchDrivers } = useDriverStore();
  const { fetchVehicles } = useVehicleStore();
  
  // Initialize data from database
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load data in parallel
        await Promise.all([
          fetchVendors(),
          fetchDrivers(),
          fetchVehicles()
        ]);
        
        console.log('✅ Successfully loaded data from database');
      } catch (err) {
        console.error('❌ Error loading data:', err);
        setError('Failed to load data. Please check your connection and refresh.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, [fetchVendors, fetchDrivers, fetchVehicles]);
  
  // Show loading screen while data is being fetched
  if (isLoading) {
    return <LoadingScreen message="Loading data..." />;
  }
  
  // Show error message if data loading failed
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-800 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleBasedDashboard />} />
            <Route path="/hierarchy" element={<OrgChart />} />
            <Route path="vendors" element={<VendorList />} />
            <Route path="drivers" element={<DriverList />} />
            <Route path="vehicles" element={<VehicleList />} />
          </Route>

          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;