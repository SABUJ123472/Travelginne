import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldAlert, User, LogOut, Menu, X, Compass, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/planner',   label: 'AI Planner' },
  { to: '/transport', label: 'Transport 🚌' },
  { to: '/rewards',   label: 'Rewards' },
  { to: '/explore',   label: 'Explore' },
  { to: '/gems',      label: 'Hidden Gems' },
  { to: '/mytrips',   label: 'My Trips' },
];

export default function Navbar({ onOpenSOS }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const [mobile, setMobile]     = useState(false);

  const handleLogout = () => {
    logout();
    setDropdown(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5] border-b border-[#e2dad0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Location Badge & Search */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2eee5] border border-[#e2dad0] text-stone-700 text-xs font-bold">
            <Compass className="w-4 h-4 text-[#c85a44]" />
            <span>Newtown, Kolkata</span>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center bg-[#f2eee5] border border-[#e2dad0] rounded-full px-3 py-1 text-xs text-stone-600">
            <Search className="w-3.5 h-3.5 text-stone-400 mr-2" />
            <input
              type="text"
              placeholder="Search field notes..."
              className="bg-transparent border-none focus:outline-none text-xs w-36 text-stone-900"
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#f2eee5] p-1.5 rounded-full border border-[#e2dad0]">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#c85a44] text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-[#e6e0d4]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fff0ed] border border-[#f5c6bc] text-[#c85a44] hover:bg-[#c85a44] hover:text-white text-xs font-bold transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          <button className="p-2 rounded-full bg-[#f2eee5] border border-[#e2dad0] text-stone-600 hover:text-stone-900">
            <Bell className="w-4 h-4" />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdown(!dropdown)}
                className="w-8 h-8 rounded-full bg-[#c85a44] text-white font-bold flex items-center justify-center text-xs shadow-sm overflow-hidden"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0]?.toUpperCase() || 'U'
                )}
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#e2dad0] shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#e2dad0]">
                    <p className="text-xs font-heritage font-bold text-stone-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-xs text-stone-700 hover:bg-[#f5efe6] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" /> Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 rounded-full bg-[#19232d] text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-sm"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => setMobile(!mobile)}
            className="xl:hidden p-2 rounded-full bg-[#f2eee5] border border-[#e2dad0] text-stone-700"
          >
            {mobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobile && (
        <div className="xl:hidden bg-[#faf8f5] border-b border-[#e2dad0] px-4 py-3 space-y-1">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobile(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-xl text-xs font-bold ${
                  isActive ? 'bg-[#c85a44] text-white' : 'text-stone-700 hover:bg-[#f2eee5]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
