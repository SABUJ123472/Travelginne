import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('travelgenie_user');
    return saved ? JSON.parse(saved) : {
      id: 'demo_user_1',
      name: 'Alex Rivera',
      email: 'alex@travelgenie.com',
      travelStyle: ['History', 'Culture', 'Food'],
      preferredBudget: 'Moderate',
      bio: 'Passionate traveler exploring the world with TravelGenie AI.'
    };
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('travelgenie_token') || 'demo_jwt_token_123');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('travelgenie_user', JSON.stringify(res.data.user));
        localStorage.setItem('travelgenie_token', res.data.token);
        return { success: true };
      }
    } catch (err) {
      // Demo fallback
      const demoUser = {
        id: 'demo_user_1',
        name: email.split('@')[0] || 'Alex Rivera',
        email,
        travelStyle: ['History', 'Culture', 'Food'],
        preferredBudget: 'Moderate',
        bio: 'Passionate traveler exploring the world with TravelGenie AI.'
      };
      setUser(demoUser);
      setToken('demo_token');
      localStorage.setItem('travelgenie_user', JSON.stringify(demoUser));
      return { success: true, message: 'Logged in (Demo Mode)' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('travelgenie_user', JSON.stringify(res.data.user));
        localStorage.setItem('travelgenie_token', res.data.token);
        return { success: true };
      }
    } catch (err) {
      // Demo fallback
      const newUser = {
        id: 'user_' + Date.now(),
        name: userData.name || 'Traveler',
        email: userData.email,
        travelStyle: userData.travelStyle || ['Culture'],
        preferredBudget: userData.preferredBudget || 'Moderate',
        bio: 'Passionate traveler.'
      };
      setUser(newUser);
      localStorage.setItem('travelgenie_user', JSON.stringify(newUser));
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('travelgenie_user');
    localStorage.removeItem('travelgenie_token');
  };

  const updatePreferences = async (newPrefs) => {
    const updated = { ...user, ...newPrefs };
    setUser(updated);
    localStorage.setItem('travelgenie_user', JSON.stringify(updated));
    try {
      await authService.updatePreferences(newPrefs);
    } catch (e) {
      // Demo fallback ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
