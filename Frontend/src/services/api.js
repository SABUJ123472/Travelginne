import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travelgenie_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

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
  checkIn: () => api.post('/rewards/check-in'),
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

export default api;
