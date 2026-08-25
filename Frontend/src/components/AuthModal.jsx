import React, { useState } from 'react';
import { Sparkles, X, Mail, Lock, User, Compass, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferredBudget: 'Moderate',
    travelStyle: ['History', 'Culture']
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await register(formData.name, formData.email, formData.password);
        if (res.success) onClose();
      } else {
        const res = await login(formData.email, formData.password);
        if (res.success) onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStyleToggle = (style) => {
    setFormData(prev => {
      const exists = prev.travelStyle.includes(style);
      return {
        ...prev,
        travelStyle: exists ? prev.travelStyle.filter(s => s !== style) : [...prev.travelStyle, style]
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bengal-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl glass-panel bg-bengal-900 border border-saffron-700/30 p-6 shadow-2xl relative puja-glow">
        {/* Alpona top stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-sindoor-600 via-saffron-400 to-sindoor-600" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-bengal-100/50 hover:text-white hover:bg-bengal-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-500 to-sindoor-500 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-saffron-500/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {isSignUp ? 'Join TravelGenie' : 'স্বাগতম!'}
          </h3>
          <p className="text-xs text-bengal-100/50 mt-1">
            {isSignUp ? 'Create your profile to unlock personalized AI trip plans' : 'Access your saved trips and personalized recommendations'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-sindoor-700/20 border border-sindoor-500/30 text-sindoor-400 text-xs font-semibold mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="auth-name" className="block text-[11px] font-bold text-saffron-300/80 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-saffron-600/50 absolute left-3 top-3" />
                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Banerjee"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-bengal-950/80 border border-saffron-700/25 text-xs text-bengal-100 placeholder-bengal-100/25 focus:outline-none focus:border-saffron-500"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-[11px] font-bold text-saffron-300/80 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-saffron-600/50 absolute left-3 top-3" />
              <input
                id="auth-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rahul@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-bengal-950/80 border border-saffron-700/25 text-xs text-bengal-100 placeholder-bengal-100/25 focus:outline-none focus:border-saffron-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-[11px] font-bold text-saffron-300/80 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-saffron-600/50 absolute left-3 top-3" />
              <input
                id="auth-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-bengal-950/80 border border-saffron-700/25 text-xs text-bengal-100 placeholder-bengal-100/25 focus:outline-none focus:border-saffron-500"
              />
            </div>
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-saffron-300/80 uppercase mb-1">Preferred Budget Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Budget', 'Moderate', 'Premium'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredBudget: b })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        formData.preferredBudget === b
                          ? 'bg-saffron-500/20 text-saffron-300 border-saffron-500/50'
                          : 'bg-bengal-950/60 text-bengal-100/40 border-saffron-700/20'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-saffron-300/80 uppercase mb-1">Travel Interests</label>
                <div className="flex flex-wrap gap-1.5">
                  {['History', 'Culture', 'Food', 'Nature', 'Adventure', 'Photography'].map((style) => {
                    const active = formData.travelStyle.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => handleStyleToggle(style)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                          active
                            ? 'bg-gradient-to-r from-saffron-500 to-sindoor-500 text-white font-bold border-saffron-400'
                            : 'bg-bengal-950 text-bengal-100/40 border-saffron-700/20'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-sindoor-500 text-white font-bold text-xs shadow-lg shadow-saffron-500/20 hover:opacity-90 transition-opacity mt-2"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Travel Profile' : 'Sign In Now'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-saffron-400 hover:underline font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'New traveler? Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
}
