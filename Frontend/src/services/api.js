import axios from 'axios';

// Use VITE_API_URL in production, fallback to /api proxy in dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Attach token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travelgenie_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('travelgenie_token');
      localStorage.removeItem('travelgenie_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updatePreferences: (data) => api.put('/auth/preferences', data),
};

export const tripService = {
  generateItinerary: (data) => api.post('/trips/generate', data),
  optimizeItinerary: (data) => api.post('/trips/optimize', data),
  saveTrip: (data) => api.post('/trips/save', data),
  getMyTrips: () => api.get('/trips/my-trips'),
  getTripById: (id) => api.get(`/trips/${id}`),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  duplicateTrip: (id) => api.post(`/trips/${id}/duplicate`),
};

export const destinationService = {
  getDestinations: (params) => api.get('/destinations', { params }),
  getHiddenGems: (params) => {
    if (typeof params === 'string') {
      return api.get('/destinations/hidden-gems', { params: { city: params } });
    }
    return api.get('/destinations/hidden-gems', { params });
  },
  getCultureStories: (params) => {
    if (typeof params === 'string') {
      return api.get('/destinations/culture-stories', { params: { city: params } });
    }
    return api.get('/destinations/culture-stories', { params });
  },
  searchCultureStory: (params) => {
    if (typeof params === 'string') {
      return api.get('/destinations/culture-search', { params: { place: params } });
    }
    return api.get('/destinations/culture-search', { params });
  },
  getSearchHistory: () => api.get('/destinations/search-history'),
};

export const assistantService = {
  chat: (data) => api.post('/assistant/chat', data),
};

export const budgetService = {
  calculate: (data) => api.post('/budget/calculate', data),
};

export const safetyService = {
  getWeatherSafety: (city) => api.get('/safety', { params: { city } }),
};

export const eventService = {
  getEvents: (params) => {
    if (typeof params === 'string') {
      return api.get('/events', { params: { city: params } });
    }
    return api.get('/events', { params });
  },
};

export const rewardService = {
  getLeaderboard: () => api.get('/rewards/leaderboard'),
  getUserStats: () => api.get('/rewards/user-stats'),
  checkIn: (data) => api.post('/rewards/check-in', data || {}),
  claimDailyBonus: () => api.post('/rewards/daily-bonus'),
  awardDestination: (destination) => api.post('/rewards/destination', { destination }),
};

export const translatorService = {
  translate: (data) => api.post('/translator/translate', data),
  getPhrases: (lang) => api.get('/translator/phrases', { params: { lang } }),
};

export const transportService = {
  getRoute: (data) => api.post('/transport/route', data),
};

export const nearbyService = {
  getNearby: (params) => api.get('/nearby', { params }),
};

// Helper to get the Google OAuth URL (full browser redirect)
export const getGoogleAuthUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    if (import.meta.env.PROD || (window.location.port !== '5173' && window.location.port !== '3000')) {
      return `${window.location.origin}/api/auth/google`;
    }
  }
  return 'http://localhost:5000/api/auth/google';
};

export default api;
