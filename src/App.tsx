import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SignInForm from './components/auth/SignInForm';
import SignUpForm from './components/auth/SignUpForm';
import Unauthorized from './pages/Unauthorized';
import RoleBasedDashboard from './components/RoleBasedDashboard';
import SuperDashboard from './pages/dashboards/SuperDashboard';
import RegionalDashboard from './pages/dashboards/RegionalDashboard';
import CityDashboard from './pages/dashboards/CityDashboard';
import LocalDashboard from './pages/dashboards/LocalDashboard';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';
import VendorList from './pages/VendorList';
import DriverList from './pages/DriverList';
import VehicleList from './pages/VehicleList';
import OrgChart from './components/OrgChart';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/landing-page';

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
      <Router basename="/VCDOS">
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <RoleBasedDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Role-specific dashboards */}
          <Route 
            path="/super-admin" 
            element={
              <ProtectedRoute requiredRole="super_admin">
                <AuthenticatedLayout>
                  <SuperDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/regional-admin" 
            element={
              <ProtectedRoute requiredRole="regional_admin">
                <AuthenticatedLayout>
                  <RegionalDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/city-admin" 
            element={
              <ProtectedRoute requiredRole="city_admin">
                <AuthenticatedLayout>
                  <CityDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/local-admin" 
            element={
              <ProtectedRoute requiredRole="local_admin">
                <AuthenticatedLayout>
                  <LocalDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy routes */}
          <Route 
            path="/vendors" 
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <VendorList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/drivers" 
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <DriverList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vehicles" 
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <VehicleList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hierarchy" 
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <OrgChart />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to landing page */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;