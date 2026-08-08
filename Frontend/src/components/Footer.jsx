import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-saffron-700/25 bg-bengal-950/95 text-bengal-100/60 py-10 px-4 mt-16 alpona-pattern">
      {/* Top alpona stripe */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-saffron-500/40 to-transparent" />
        <div className="flex justify-center gap-3 py-3 text-saffron-500/40 text-xs tracking-widest">
          ✦ ❋ ✦ ❋ ✦ ❋ ✦
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-sindoor-500/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-saffron-500 to-sindoor-500 flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">TravelGenie</span>
          </div>
          <p className="text-[11px] text-bengal-100/50 leading-relaxed mb-2">
            বাংলার স্মার্ট ভ্রমণ সঙ্গী — Your AI-powered travel companion for Bengal and beyond.
          </p>
          <p className="text-[10px] text-saffron-500/60 italic">
            "আনন্দময় ভ্রমণ হোক সবার"
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-saffron-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="text-saffron-500">✦</span> Core Features
          </h4>
          <ul className="space-y-1.5 text-xs">
            {[['AI Trip Planner','/planner'],['Hidden Gems Discovery','/gems'],['Smart Budget Calculator','/budget'],['Weather & Safety Advisories','/weather']].map(([label,to]) => (
              <li key={label}><Link to={to} className="hover:text-saffron-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-saffron-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="text-sindoor-400">✦</span> Cultural Tools
          </h4>
          <ul className="space-y-1.5 text-xs">
            {[['Language Phrasebook','/translator'],['Stories & Local Etiquette','/culture'],['Local Festivals & Events','/events'],['Public Transport Navigator','/transport']].map(([label,to]) => (
              <li key={label}><Link to={to} className="hover:text-saffron-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-saffron-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="text-mustard-400">✦</span> Hackathon Info
          </h4>
          <p className="text-xs text-bengal-100/50 mb-2">
            Built with ❤️ for College Hackathon 2026.
          </p>
          <div className="flex items-center gap-2 text-xs text-saffron-400 font-semibold">
            <Shield className="w-4 h-4" />
            <span>Hackathon MVP Ready</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        <div className="h-px bg-gradient-to-r from-transparent via-saffron-700/30 to-transparent mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-bengal-100/40">
          <p>© 2026 TravelGenie. All rights reserved.</p>
          <p>Powered by Node.js, Express, MongoDB & React</p>
        </div>
      </div>
    </footer>
  );
}
