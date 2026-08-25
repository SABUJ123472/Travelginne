import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// This page handles the redirect after Google OAuth success.
// Backend redirects to: /auth/callback?token=JWT&user=JSON
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userRaw = params.get('user');

    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw));
        loginWithToken(token, user);
        setTimeout(() => navigate('/dashboard', { replace: true }), 500);
      } catch (e) {
        navigate('/login?error=google_failed', { replace: true });
      }
    } else {
      navigate('/login?error=google_failed', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1a12] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e8a048] to-[#c85a44] flex items-center justify-center shadow-lg shadow-[#c85a44]/30 animate-pulse">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <p className="text-white font-bold text-sm">Signing you in with Google...</p>
      <div className="w-48 h-1 bg-[#2b5934]/40 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#e8a048] to-[#c85a44] rounded-full animate-pulse" style={{ width: '70%' }} />
      </div>
    </div>
  );
}
