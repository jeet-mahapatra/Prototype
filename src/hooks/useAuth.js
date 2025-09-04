// Custom hook for authentication logic

import { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useLocalStorage } from './useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export const useAuth = () => {
  const [user, setUser] = useLocalStorage(LOCAL_STORAGE_KEYS.USER, null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = async () => {
      try {
        const isValid = await authService.verifySession?.();
        if (!isValid) {
          setUser(null);
        } else if (!user) {
          // hydrate from service if present
          const current = authService.getCurrentUser?.();
          if (current) setUser(current);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (arg1, arg2) => {
    try {
      setLoading(true);
      setError(null);
      // Support both login({email, password}) and login(email, password)
      const email = typeof arg1 === 'object' ? arg1.email : arg1;
      const password = typeof arg1 === 'object' ? arg1.password : arg2;
      const result = await authService.login(email, password);
      if (result?.success) {
        setUser(result.user);
        return result;
      }
      const message = result?.error || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } catch (err) {
      const message = err?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.register(userData);
      if (result?.success) {
        setUser(result.user);
        return result;
      }
      const message = result?.error || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } catch (err) {
      const message = err?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(user.id, updates);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isCitizen = () => {
    return user?.role === 'citizen';
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    isAdmin,
    isCitizen,
    setError
  };
};
