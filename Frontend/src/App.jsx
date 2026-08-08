import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

import LandingPage            from './pages/LandingPage';
import DashboardPage          from './pages/DashboardPage';
import AITripPlannerPage      from './pages/AITripPlannerPage';
import AIAssistantPage        from './pages/AIAssistantPage';
import ExplorePage            from './pages/ExplorePage';
import HiddenGemsPage         from './pages/HiddenGemsPage';
import BudgetPlannerPage      from './pages/BudgetPlannerPage';
import WeatherSafetyPage      from './pages/WeatherSafetyPage';
import TranslatorPage         from './pages/TranslatorPage';
import CultureStoriesPage     from './pages/CultureStoriesPage';
import EventsPage             from './pages/EventsPage';
import NearbyPage             from './pages/NearbyPage';
import PublicTransportPage    from './pages/PublicTransportPage';
import LeaderboardRewardsPage from './pages/LeaderboardRewardsPage';
import MyTripsPage            from './pages/MyTripsPage';
import ProfilePage            from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard"  element={<DashboardPage />} />
            <Route path="/planner"    element={<AITripPlannerPage />} />
            <Route path="/assistant"  element={<AIAssistantPage />} />
            <Route path="/explore"    element={<ExplorePage />} />
            <Route path="/gems"       element={<HiddenGemsPage />} />
            <Route path="/budget"     element={<BudgetPlannerPage />} />
            <Route path="/weather"    element={<WeatherSafetyPage />} />
            <Route path="/translator" element={<TranslatorPage />} />
            <Route path="/culture"    element={<CultureStoriesPage />} />
            <Route path="/events"     element={<EventsPage />} />
            <Route path="/rewards"    element={<LeaderboardRewardsPage />} />
            <Route path="/nearby"     element={<NearbyPage />} />
            <Route path="/transport"  element={<PublicTransportPage />} />
            <Route path="/mytrips"    element={<MyTripsPage />} />
            <Route path="/profile"    element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
