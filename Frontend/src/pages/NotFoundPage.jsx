import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0e1a12] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#c85a44]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#e8a048]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#e8a048] to-[#c85a44] flex items-center justify-center mx-auto shadow-xl shadow-[#c85a44]/30 animate-bounce">
          <Compass className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#e8a048] tracking-widest uppercase">Off the Map</span>
          <h1 className="text-4xl font-extrabold text-white">404 - Lost in Transit</h1>
          <p className="text-xs text-[#a8c4ad]/70 leading-relaxed">
            The page or travel route you are looking for has vanished into archival lore or moved to a new destination.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e8a048] to-[#c85a44] text-white text-xs font-bold shadow-lg shadow-[#c85a44]/25 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
