import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { Sparkles } from 'lucide-react';

// Lazy load pages for fast initial page load & optimal code-splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AITripPlannerPage = lazy(() => import('./pages/AITripPlannerPage'));
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const HiddenGemsPage = lazy(() => import('./pages/HiddenGemsPage'));
const BudgetPlannerPage = lazy(() => import('./pages/BudgetPlannerPage'));
const WeatherSafetyPage = lazy(() => import('./pages/WeatherSafetyPage'));
const TranslatorPage = lazy(() => import('./pages/TranslatorPage'));
const CultureStoriesPage = lazy(() => import('./pages/CultureStoriesPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const NearbyPage = lazy(() => import('./pages/NearbyPage'));
const PublicTransportPage = lazy(() => import('./pages/PublicTransportPage'));
const MyTripsPage = lazy(() => import('./pages/MyTripsPage'));
const LeaderboardRewardsPage = lazy(() => import('./pages/LeaderboardRewardsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Branded loading spinner for code-split transitions
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e8a048] to-[#c85a44] flex items-center justify-center shadow-lg shadow-[#c85a44]/20 animate-spin">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs font-bold text-stone-500 tracking-wider uppercase animate-pulse">
        Accessing Travel Ledger...
      </p>
    </div>
  );
}

// Protected route — redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected app routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/planner" element={<AITripPlannerPage />} />
          <Route path="/assistant" element={<AIAssistantPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/gems" element={<HiddenGemsPage />} />
          <Route path="/budget" element={<BudgetPlannerPage />} />
          <Route path="/weather" element={<WeatherSafetyPage />} />
          <Route path="/translator" element={<TranslatorPage />} />
          <Route path="/culture" element={<CultureStoriesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/nearby" element={<NearbyPage />} />
          <Route path="/transport" element={<PublicTransportPage />} />
          <Route path="/mytrips" element={<MyTripsPage />} />
          <Route path="/rewards" element={<LeaderboardRewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 Route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
