import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SignInData, SignUpData } from '../services/authService';
import { authService } from '../services/authService';
import { UserRole } from '../db/schema/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const userData = authService.verifyToken(savedToken);
        if (userData) {
          // In a real app, you would fetch the full user data from the server
          // For now, we'll use the data from the token
          setUser({
            id: userData.id,
            role: userData.role as UserRole,
            email: userData.email || '',
            name: userData.name || '',
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    
    // Define the role hierarchy
    const roleHierarchy: Record<UserRole, UserRole[]> = {
      'super_admin': ['super_admin'],
      'regional_admin': ['super_admin', 'regional_admin'],
      'city_admin': ['super_admin', 'regional_admin', 'city_admin'],
      'local_admin': ['super_admin', 'regional_admin', 'city_admin', 'local_admin'],
    };
    
    // Check if user's role is in the permitted roles for the required access level
    return roleHierarchy[role].includes(user.role);
  };

  const signIn = async (data: SignInData) => {
    setIsLoading(true);
    try {
      const result = await authService.signIn(data);
      setUser(result.user as User);
      localStorage.setItem('token', result.token);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      const result = await authService.signUp(data);
      setUser(result.user as User);
      localStorage.setItem('token', result.token);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        isLoading,
        hasRole, 
        signIn, 
        signUp, 
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}