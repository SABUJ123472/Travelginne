import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Sparkles, Compass, Gem, Wallet, MapPin,
  Languages, ShieldCheck, BookOpen, CalendarDays, Bus,
  Briefcase, User, Trophy, Flame
} from 'lucide-react';

const MENU = [
  { to: '/dashboard',  label: 'Dashboard',           icon: LayoutDashboard },
  { to: '/planner',    label: 'AI Trip Planner',      icon: Sparkles, highlight: true },
  { to: '/transport',  label: 'Transport Navigator',  icon: Bus, highlight: true },
  { to: '/rewards',    label: 'Rewards & Rank',       icon: Trophy },
  { to: '/explore',    label: 'Explore',              icon: Compass },
  { to: '/gems',       label: 'Hidden Gems',          icon: Gem },
  { to: '/mytrips',    label: 'My Trips',             icon: Briefcase },
  { to: '/budget',     label: 'Budget Planner',       icon: Wallet },
  { to: '/weather',    label: 'Weather & Safety',     icon: ShieldCheck },
  { to: '/translator', label: 'Translator',           icon: Languages },
  { to: '/culture',    label: 'Local Culture',        icon: BookOpen },
  { to: '/events',     label: 'Local Events',         icon: CalendarDays },
  { to: '/nearby',     label: 'Nearby Search',        icon: MapPin },
  { to: '/profile',    label: 'Profile',              icon: User },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-[#f2eee5] border-r border-[#e2dad0] hidden lg:block py-6 px-4 shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Brand Header */}
      <div className="px-3 pb-6 mb-4 border-b border-[#e2dad0]">
        <span className="text-[10px] font-bold tracking-widest text-[#c85a44] uppercase block">
          FIELD JOURNAL & LOG
        </span>
        <h2 className="text-xl font-heritage font-extrabold text-stone-900 tracking-tight">
          TRAVELGENIE
        </h2>
      </div>

      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold tracking-widest text-stone-500 uppercase mb-2">✦ Navigation ✦</p>
        {MENU.map(({ to, label, icon: Icon, highlight }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#c85a44] text-white shadow-sm font-bold'
                  : highlight
                  ? 'text-[#c85a44] font-bold hover:bg-[#e6dfd3]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-[#e6dfd3]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span className="truncate">{label}</span>
                {highlight && !isActive && <span className="ml-auto w-2 h-2 rounded-full bg-[#c85a44]" />}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-[#e2dad0] space-y-3">
        <div className="p-4 rounded-2xl bg-white border border-[#e2dad0] space-y-2 text-center shadow-sm">
          <Flame className="w-5 h-5 text-[#c85a44] mx-auto" />
          <h4 className="text-xs font-heritage font-bold text-stone-900">Need AI Guidance?</h4>
          <p className="text-[10px] text-stone-500">Ask TravelGenie AI anything in real-time.</p>
          <button
            onClick={() => navigate('/assistant')}
            className="w-full py-2 rounded-xl bg-[#19232d] text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm"
          >
            Open Assistant
          </button>
        </div>
      </div>
    </aside>
  );
}
