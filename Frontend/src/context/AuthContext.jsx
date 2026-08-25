import React, { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

// Load persisted session from localStorage
const loadPersistedUser = () => {
  try {
    const token = localStorage.getItem('travelgenie_token');
    const storedUser = localStorage.getItem('travelgenie_user');
    if (token && storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (e) {}
  return null; // Not logged in
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadPersistedUser);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const isAuthenticated = !!user;

  // Persist user + token to localStorage
  const persistSession = (token, userData) => {
    localStorage.setItem('travelgenie_token', token);
    localStorage.setItem('travelgenie_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await authService.login({ email, password });
      if (res.data.success) {
        persistSession(res.data.token, res.data.user);
        return { success: true };
      }
      throw new Error(res.data.message || 'Login failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, travelStyle, preferredBudget) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await authService.register({ name, email, password, travelStyle, preferredBudget });
      if (res.data.success) {
        persistSession(res.data.token, res.data.user);
        return { success: true };
      }
      throw new Error(res.data.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Called by /auth/callback page after Google OAuth
  const loginWithToken = useCallback((token, userData) => {
    persistSession(token, userData);
  }, []);

  const logout = () => {
    localStorage.removeItem('travelgenie_token');
    localStorage.removeItem('travelgenie_user');
    setUser(null);
    setAuthError('');
  };

  const updatePreferences = async (data) => {
    try {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('travelgenie_user', JSON.stringify(updated));
      await authService.updatePreferences(data);
    } catch (err) {}
  };

  const clearError = () => setAuthError('');

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      isAuthenticated,
      login,
      register,
      loginWithToken,
      logout,
      updatePreferences,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
