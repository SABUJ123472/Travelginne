import React, { useState } from 'react';
import { User, Mail, Award, MapPin, Compass, Shield, Settings, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updatePreferences } = useAuth();
  const [name, setName] = useState(user?.name || 'Sabuj');
  const [email, setEmail] = useState(user?.email || 'sabuj@expedition.org');
  const [preferredBudget, setPreferredBudget] = useState(user?.preferredBudget || 'Moderate');
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updatePreferences({ name, email, preferredBudget });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

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
              {user?.tier || 'GOLD EXPLORER'}
            </span>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-bengali">
              অভিযাত্রী প্রোফাইল
            </span>
          </div>
          <h1 className="text-2xl font-heritage font-extrabold text-stone-900">{user?.name || 'Sabuj'}</h1>
          <p className="text-xs text-stone-500">{user?.email || 'sabuj@expedition.org'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] text-center space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">GeniePoints</span>
          <span className="text-2xl font-heritage font-extrabold text-[#c85a44]">{user?.points || 450} PTS</span>
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
              <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">Preferred Travel Budget Tier</label>
            <select
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
