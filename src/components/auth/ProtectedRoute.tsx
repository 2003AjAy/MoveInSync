import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import { UserRole } from '../../db/schema/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

/**
 * A component that protects routes based on authentication and role requirements
 */
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // FIX: Remove the duplicate /VCDOS prefix as it's already handled by the Router basename
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && !hasRole(requiredRole)) {
    // FIX: Remove the duplicate /VCDOS prefix
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if all checks pass
  return <>{children}</>;
}
