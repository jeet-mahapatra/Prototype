// Header component with navigation and user profile

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import UserProfile from '../auth/UserProfile';
import AuthModal from '../auth/AuthModal';

const Header = () => {
  const { user, isAuthenticated, isAdmin } = useAuthContext();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏛️</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Civic Connect</h1>
                <p className="text-xs text-gray-500">Government of Jharkhand</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to={isAuthenticated() ? '/user' : '/'} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
            {isAuthenticated() && isAdmin?.() && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Admin Console</Link>
            )}
            {isAuthenticated() && (
              <Link to="/user/report" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Report Issue</Link>
            )}
            {isAuthenticated() && (
              <Link to="/user/issues" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">My Issues</Link>
            )}
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
          </nav>

          {/* User Authentication */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <UserProfile />
            ) : (
              <div className="flex items-center space-x-2">
                <AuthModal />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          <Link to={isAuthenticated() ? '/user' : '/'} className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
          {isAuthenticated() && isAdmin?.() && (
            <Link to="/admin" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Admin Console</Link>
          )}
          {isAuthenticated() && (
            <Link to="/user/report" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Report Issue</Link>
          )}
          {isAuthenticated() && (
            <Link to="/user/issues" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">My Issues</Link>
          )}
          <Link to="/" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">About</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
