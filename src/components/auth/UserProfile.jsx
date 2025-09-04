import { useState } from "react";
import authService from "../../services/authService.js";
import { useAuthContext } from "../../context/AuthContext";

function UserProfile() {
  const { user, logout } = useAuthContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  // Don't render if no user
  if (!user) {
    return null;
  }

  const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U';
  const displayName = user.name || 'User';

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium text-sm">
          {userInitials}
        </div>
        <span className="hidden sm:block font-medium">{displayName}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email || 'No email'}</p>
                <p className="text-xs text-gray-400">📍 {user?.location || 'No location'}</p>
              </div>
            </div>
            
            {user.role === 'admin' && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                  🛡️ Administrator
                </span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setShowDropdown(false);
                // Add profile edit functionality later
                alert("Profile editing coming soon!");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>⚙️</span>
              <span>Edit Profile</span>
            </button>
            
            <button
              onClick={() => {
                setShowDropdown(false);
                // Add my issues view later
                alert("My Issues view coming soon!");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>📋</span>
              <span>My Issues</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Add admin panel later
                  alert("Admin panel coming soon!");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <span>🛡️</span>
                <span>Admin Panel</span>
              </button>
            )}

            <hr className="my-2" />
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>

          {/* Account Info */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Member since</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            {user.lastLogin && (
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Last login</span>
                <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}

export default UserProfile;
