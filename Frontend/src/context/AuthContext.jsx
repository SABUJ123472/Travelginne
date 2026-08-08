import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('travelgenie_token');
    const storedUser = localStorage.getItem('travelgenie_user');
    if (token && storedUser) {
      try { return JSON.parse(storedUser); } catch (e) {}
    }
    return {
      id: 'demo_user_1',
      name: 'Sabuj',
      email: 'sabuj@expedition.org',
      points: 450,
      tier: 'Gold Explorer',
      preferredBudget: 'Moderate',
      travelStyle: ['History', 'Culture', 'Food'],
    };
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.data.success) {
        const { token, user: userData } = res.data;
        localStorage.setItem('travelgenie_token', token);
        localStorage.setItem('travelgenie_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      // Demo fallback login
      const demoUser = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0] || 'Sabuj',
        email,
        points: 100,
        tier: 'Bronze Explorer',
        preferredBudget: 'Moderate',
        travelStyle: ['Culture', 'Food'],
      };
      localStorage.setItem('travelgenie_token', 'demo_token_' + Date.now());
      localStorage.setItem('travelgenie_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await authService.register({ name, email, password });
      if (res.data.success) {
        const { token, user: userData } = res.data;
        localStorage.setItem('travelgenie_token', token);
        localStorage.setItem('travelgenie_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      const demoUser = {
        id: 'user_' + Date.now(),
        name: name || 'Sabuj',
        email,
        points: 50,
        tier: 'Bronze Explorer',
        preferredBudget: 'Moderate',
        travelStyle: ['Culture'],
      };
      localStorage.setItem('travelgenie_token', 'demo_token_' + Date.now());
      localStorage.setItem('travelgenie_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('travelgenie_token');
    localStorage.removeItem('travelgenie_user');
    setUser(null);
  };

  const updatePreferences = async (data) => {
    try {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('travelgenie_user', JSON.stringify(updated));
      await authService.updatePreferences(data);
    } catch (err) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
