import React, { useState } from 'react';
import { User, Mail, Wallet, Compass, Save, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updatePreferences } = useAuth();
  const [preferredBudget, setPreferredBudget] = useState(user?.preferredBudget || 'Moderate');
  const [travelStyle, setTravelStyle] = useState(user?.travelStyle || ['History', 'Culture', 'Food']);
  const [bio, setBio] = useState(user?.bio || 'Passionate explorer cataloging discoveries with TravelGenie AI.');
  const [saved, setSaved] = useState(false);

  const handleStyleToggle = (style) => {
    setTravelStyle(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updatePreferences({ preferredBudget, travelStyle, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#c85a44] text-white font-heritage font-extrabold text-2xl flex items-center justify-center shadow-sm shrink-0">
          {user?.name ? user.name[0].toUpperCase() : 'A'}
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-heritage font-extrabold text-stone-900">{user?.name || 'Alex Rivera'}</h1>
          <p className="text-xs text-stone-500">{user?.email || 'alex.rivera@expedition.org'}</p>
          <span className="inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full bg-[#f2eee5] border border-[#e2dad0] text-[#c85a44] text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-[#c85a44]" />
            Verified Explorer Ledger
          </span>
        </div>
      </div>

      {/* Form Settings */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] space-y-6 shadow-sm">
        <h3 className="text-lg font-heritage font-extrabold text-stone-900 border-b border-[#e2dad0] pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-[#c85a44]" />
          <span>Explorer Profile & Travel Preferences</span>
        </h3>

        {saved && (
          <div className="p-3.5 rounded-xl bg-[#c3dec9] border border-[#a8caa7] text-xs font-semibold text-[#1e3b23] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#2b5934]" />
            <span>Profile preferences cataloged successfully!</span>
          </div>
        )}

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Explorer Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52] resize-none"
          />
        </div>

        {/* Budget Style */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Default Resource Allocation</label>
          <div className="grid grid-cols-3 gap-3">
            {['Shoestring', 'Standard', 'Opulent'].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setPreferredBudget(b)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  preferredBudget === b
                    ? 'bg-[#c85a44] text-white border-[#c85a44] shadow-sm'
                    : 'bg-[#f2eee5] text-stone-700 border-[#e2dad0] hover:bg-[#e6e0d4]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Interests */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Favorite Travel Styles</label>
          <div className="flex flex-wrap gap-2">
            {[
              'Adventure', 'Relaxation', 'History', 'Culture', 
              'Food', 'Nature', 'Shopping', 'Photography', 'Nightlife', 'Spiritual'
            ].map((style) => {
              const active = travelStyle.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleStyleToggle(style)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    active
                      ? 'bg-[#c85a44] text-white border-[#c85a44] shadow-sm'
                      : 'bg-[#f2eee5] text-stone-700 border-[#e2dad0] hover:bg-[#e6e0d4]'
                  }`}
                >
                  {active ? '✓ ' : ''}{style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#19232d] text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4 text-[#d96b52]" />
          <span>Save Profile Ledger</span>
        </button>

      </form>
    </div>
  );
}
