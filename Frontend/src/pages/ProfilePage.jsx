import React, { useState, useEffect } from 'react';
import { User, Mail, Award, MapPin, Compass, Shield, Settings, Check, Sparkles, Trophy, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { rewardService, authService } from '../services/api';

export default function ProfilePage() {
  const { user, updatePreferences } = useAuth();
  const [name, setName] = useState(user?.name || 'Sabuj');
  const [email, setEmail] = useState(user?.email || 'sabuj@expedition.org');
  const [preferredBudget, setPreferredBudget] = useState(user?.preferredBudget || 'Moderate');
  const [userStats, setUserStats] = useState(null);
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
    if (user?.preferredBudget) setPreferredBudget(user.preferredBudget);

    // Fetch real-time rewards & points stats from backend
    rewardService.getUserStats()
      .then(res => {
        if (res.data?.success && res.data.stats) {
          setUserStats(res.data.stats);
        }
      })
      .catch(() => {});
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    updatePreferences({ name, email, preferredBudget });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const currentPoints = userStats?.points ?? userStats?.geniePoints ?? user?.geniePoints ?? 0;
  const currentRank = userStats?.rank ?? userStats?.travelerRank ?? user?.travelerRank ?? 'Bronze Explorer';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Profile Header */}
      <div className="p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-[#c85a44] text-white font-heritage font-extrabold text-3xl flex items-center justify-center shadow-md border-4 border-white">
          {name[0]?.toUpperCase() || 'S'}
        </div>
        
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
              {currentRank}
            </span>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-bengali">
              অভিযাত্রী প্রোফাইল
            </span>
          </div>
          <h1 className="text-2xl font-heritage font-extrabold text-stone-900">{name || 'Sabuj'}</h1>
          <p className="text-xs text-stone-500">{email || 'sabuj@expedition.org'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] text-center space-y-1 min-w-[140px]">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">GeniePoints</span>
          <span className="text-2xl font-heritage font-extrabold text-[#c85a44]">{currentPoints} PTS</span>
        </div>
      </div>

      {/* Badges & Milestones Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#e2dad0] shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#c85a44]" /> Rank Tier
          </span>
          <p className="text-lg font-heritage font-extrabold text-stone-900">{currentRank}</p>
          <p className="text-[11px] text-stone-500">Next tier at {userStats?.nextRankPoints || 300} PTS</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e2dad0] shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#c85a44]" /> Total Points
          </span>
          <p className="text-lg font-heritage font-extrabold text-[#c85a44]">{currentPoints} PTS</p>
          <p className="text-[11px] text-stone-500">Earn +50 per destination</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e2dad0] shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#c85a44]" /> Expeditions Logged
          </span>
          <p className="text-lg font-heritage font-extrabold text-stone-900">
            {userStats?.checkInsCount ?? userStats?.checkIns?.length ?? 0} Check-ins
          </p>
          <p className="text-[11px] text-stone-500">Saved to explorer ledger</p>
        </div>
      </div>

      {/* Account Settings Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-[#e2dad0] pb-4">
          <Settings className="w-5 h-5 text-[#c85a44]" />
          <h2 className="text-xl font-heritage font-extrabold text-stone-900">Explorer Credentials & Preferences</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="profile-name" className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">Full Name</label>
              <input
                id="profile-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="profile-email" className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">Email Address</label>
              <input
                id="profile-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="profile-budget" className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">Preferred Travel Budget Tier</label>
            <select
              id="profile-budget"
              name="preferredBudget"
              value={preferredBudget}
              onChange={(e) => setPreferredBudget(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none"
            >
              <option value="Shoestring">Shoestring (Backpacker / Low Budget)</option>
              <option value="Moderate">Moderate (Standard Comfort)</option>
              <option value="Opulent">Opulent (Luxury Resorts & Private Drivers)</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] transition-colors flex items-center gap-2 shadow-sm"
          >
            {savedStatus ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{savedStatus ? 'Saved to Profile Ledger!' : 'Save Profile Preferences'}</span>
          </button>
        </form>
      </div>

    </div>
  );
}
