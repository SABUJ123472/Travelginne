import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getGoogleAuthUrl } from '../services/api';

const TRAVEL_STYLES = ['History', 'Culture', 'Food', 'Nature', 'Adventure', 'Photography'];
const BUDGETS = ['Budget', 'Moderate', 'Premium'];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, loading, authError, clearError } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferredBudget: 'Moderate',
    travelStyle: ['History', 'Culture'],
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle Google OAuth error from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const err = params.get('error');
    if (err === 'google_failed') {
      setGoogleError('Google sign-in failed. Please try again or use email.');
    } else if (err === 'google_not_configured') {
      setGoogleError('Google Sign-In is not configured yet in environment variables. Please use Email/Password.');
    } else if (err === 'server_error') {
      setGoogleError('An authentication error occurred. Please try email login.');
    }
  }, [location]);

  const handleChange = (e) => {
    clearError();
    setGoogleError('');
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleStyle = (style) => {
    setFormData(prev => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter(s => s !== style)
        : [...prev.travelStyle, style],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (isSignUp) {
      const res = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.travelStyle,
        formData.preferredBudget
      );
      if (res.success) navigate('/dashboard', { replace: true });
    } else {
      const res = await login(formData.email, formData.password);
      if (res.success) navigate('/dashboard', { replace: true });
    }
  };

  const handleGoogleLogin = () => {
    // Redirects to dynamic backend Google OAuth endpoint
    window.location.href = getGoogleAuthUrl();
  };

  const switchMode = () => {
    clearError();
    setGoogleError('');
    setIsSignUp(prev => !prev);
  };

  const errorMsg = authError || googleError;

  return (
    <div className="min-h-screen bg-[#0e1a12] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c85a44]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#e8a048]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#2b5934]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c85a44] via-[#e8a048] to-[#c85a44]" />

      {/* Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e8a048] to-[#c85a44] flex items-center justify-center shadow-lg shadow-[#c85a44]/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">TravelGenie</span>
          </div>
          <p className="text-[#a8c4ad]/60 text-xs">AI-Powered Travel Planning for India & Beyond</p>
        </div>

        {/* Panel */}
        <div className="bg-[#152019]/90 backdrop-blur-xl border border-[#2b5934]/40 rounded-3xl p-7 shadow-2xl shadow-black/40">
          {/* Top stripe */}
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl bg-gradient-to-r from-transparent via-[#e8a048]/50 to-transparent" />

          {/* Tab Toggle */}
          <div className="flex bg-[#0e1a12]/80 rounded-2xl p-1 mb-6">
            <button
              onClick={() => !isSignUp || switchMode()}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${!isSignUp ? 'bg-gradient-to-r from-[#e8a048] to-[#c85a44] text-white shadow-lg' : 'text-[#a8c4ad]/50 hover:text-[#a8c4ad]'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => isSignUp || switchMode()}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${isSignUp ? 'bg-gradient-to-r from-[#e8a048] to-[#c85a44] text-white shadow-lg' : 'text-[#a8c4ad]/50 hover:text-[#a8c4ad]'}`}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h1 className="text-lg font-extrabold text-white">
              {isSignUp ? 'Join TravelGenie' : 'স্বাগতম! Welcome back'}
            </h1>
            <p className="text-[11px] text-[#a8c4ad]/50 mt-0.5">
              {isSignUp ? 'Create your profile to unlock AI-powered travel plans' : 'Sign in to access your trips and recommendations'}
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#c85a44]/15 border border-[#c85a44]/30 text-[#f4a08a] text-xs font-medium flex items-start gap-2">
              <span className="mt-0.5">⚠</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 hover:border-white/20 transition-all mb-4 group"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#2b5934]/40" />
            <span className="text-[10px] text-[#a8c4ad]/40 font-medium uppercase tracking-wider">or continue with email</span>
            <div className="flex-1 h-px bg-[#2b5934]/40" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name — signup only */}
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-bold text-[#e8a048]/70 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#e8a048]/40 absolute left-3 top-3" />
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Banerjee"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0e1a12]/80 border border-[#2b5934]/40 text-xs text-white placeholder-[#a8c4ad]/25 focus:outline-none focus:border-[#e8a048]/60 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-[#e8a048]/70 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#e8a048]/40 absolute left-3 top-3" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0e1a12]/80 border border-[#2b5934]/40 text-xs text-white placeholder-[#a8c4ad]/25 focus:outline-none focus:border-[#e8a048]/60 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-[#e8a048]/70 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#e8a048]/40 absolute left-3 top-3" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#0e1a12]/80 border border-[#2b5934]/40 text-xs text-white placeholder-[#a8c4ad]/25 focus:outline-none focus:border-[#e8a048]/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-2.5 text-[#a8c4ad]/30 hover:text-[#a8c4ad]/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {isSignUp && <p className="text-[10px] text-[#a8c4ad]/30 mt-1 ml-1">Minimum 6 characters</p>}
            </div>

            {/* Signup extras */}
            {isSignUp && (
              <>
                {/* Budget */}
                <div>
                  <label className="block text-[10px] font-bold text-[#e8a048]/70 uppercase tracking-wider mb-1.5">Budget Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {BUDGETS.map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, preferredBudget: b }))}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          formData.preferredBudget === b
                            ? 'bg-gradient-to-r from-[#e8a048]/20 to-[#c85a44]/20 text-[#e8a048] border-[#e8a048]/40'
                            : 'bg-[#0e1a12]/60 text-[#a8c4ad]/40 border-[#2b5934]/30 hover:border-[#2b5934]/60'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travel interests */}
                <div>
                  <label className="block text-[10px] font-bold text-[#e8a048]/70 uppercase tracking-wider mb-1.5">Travel Interests</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TRAVEL_STYLES.map(style => {
                      const active = formData.travelStyle.includes(style);
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => toggleStyle(style)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                            active
                              ? 'bg-gradient-to-r from-[#e8a048] to-[#c85a44] text-white border-transparent'
                              : 'bg-[#0e1a12]/60 text-[#a8c4ad]/40 border-[#2b5934]/30 hover:border-[#2b5934]/60'
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e8a048] to-[#c85a44] text-white font-bold text-xs shadow-lg shadow-[#c85a44]/25 hover:opacity-90 disabled:opacity-50 transition-all mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isSignUp ? 'Create My Travel Profile' : 'Sign In to TravelGenie'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-[11px] text-[#a8c4ad]/40 mt-4">
            {isSignUp ? 'Already have an account?' : 'New to TravelGenie?'}{' '}
            <button onClick={switchMode} className="text-[#e8a048] hover:underline font-semibold">
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-[#a8c4ad]/25 mt-4">
          Your data is stored securely. We never share your information.
        </p>
      </div>
    </div>
  );
}
