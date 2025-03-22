import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, signOut, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = window.location.pathname;

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">VCDOS</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="/dashboard"
                  className={`${location.includes('/dashboard') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/dashboard');
                  }}
                >
                  Dashboard
                </a>
                <a
                  href="/vendors"
                  className={`${location.includes('/vendors') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/vendors');
                  }}
                >
                  Vendors
                </a>
                <a
                  href="/vehicles"
                  className={`${location.includes('/vehicles') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/vehicles');
                  }}
                >
                  Vehicles
                </a>
                <a
                  href="/drivers"
                  className={`${location.includes('/drivers') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/drivers');
                  }}
                >
                  Drivers
                </a>
                {/* {user?.role === 'super_admin' && (
                  <a
                    href="/admin"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/admin');
                    }}
                  >
                    Admin Panel
                  </a>
                )} */}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-800 font-medium">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>
                </div>

                {isMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <div className="block px-4 py-2 text-xs text-gray-400">
                      Signed in as
                    </div>
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b">
                      <div>{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                      <div className="text-xs mt-1 inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                        {user?.role}
                      </div>
                    </div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/profile');
                        setIsMenuOpen(false);
                      }}
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSignOut();
                      }}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
              <a
                href="/dashboard"
                className={`${location.includes('/dashboard') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
              >
                Dashboard
              </a>
              <a
                href="/vendors"
                className={`${location.includes('/vendors') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/vendors');
                  setIsMenuOpen(false);
                }}
              >
                Vendors
              </a>
              <a
                href="/vehicles"
                className={`${location.includes('/vehicles') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/vehicles');
                  setIsMenuOpen(false);
                }}
              >
                Vehicles
              </a>
              <a
                href="/drivers"
                className={`${location.includes('/drivers') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/drivers');
                  setIsMenuOpen(false);
                }}
              >
                Drivers
              </a>
              {user?.role === 'super_admin' && (
                <a
                  href="/admin"
                  className="block px-4 py-2 text-sm text-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/admin');
                    setIsMenuOpen(false);
                  }}
                >
                  Admin Panel
                </a>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-medium">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  <div className="text-xs mt-1 inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    {user?.role}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSignOut();
                  }}
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
