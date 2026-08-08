import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Compass, Gem, Wallet, ShieldCheck, Bot,
  Languages, BookOpen, Bus, ArrowRight, CheckCircle2, Flame, Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import EmergencyModal from '../components/EmergencyModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('Kolkata');
  const [authOpen, setAuthOpen] = useState(false);
  const [sosOpen,  setSosOpen]  = useState(false);

  const handlePlan = (e) => {
    e?.preventDefault();
    navigate(`/planner?city=${encodeURIComponent(destination || 'Kolkata')}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f0804', color: '#f9e8c0' }}>
      <Navbar onOpenAuth={() => setAuthOpen(true)} onOpenSOS={() => setSosOpen(true)} />

      <main className="flex-1 space-y-24 pb-16">

        {/* ── Hero ── */}
        <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-saffron-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-sindoor-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sindoor-600 via-saffron-400 via-mustard-400 via-saffron-400 to-sindoor-600 opacity-60" />

          <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bengal-800/80 border border-saffron-500/35 text-saffron-300 text-xs font-semibold">
              <Flame className="w-4 h-4 text-saffron-400 animate-pulse" />
              <span>AI-Powered Smart Tourism — বাংলার গর্ব</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              ভ্রমণ করুন স্মার্টভাবে। <br />
              <span className="text-gradient">TravelGenie.</span>
            </h1>

            <p className="text-base sm:text-lg text-bengal-100/80 max-w-2xl mx-auto leading-relaxed">
              Your AI-powered travel companion for personalized itineraries, hidden gems, local Bengali experiences, safety alerts, and smarter journeys across the world.
            </p>

            <form onSubmit={handlePlan} className="max-w-2xl mx-auto glass-panel p-2.5 rounded-2xl md:rounded-full border border-saffron-700/40 shadow-2xl puja-glow flex flex-col md:flex-row items-center gap-2">
              <div className="flex items-center gap-2.5 px-4 py-2 w-full flex-1">
                <MapPin className="w-5 h-5 text-saffron-400 shrink-0" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="কোথায় যেতে চান? (e.g. Paris, Tokyo, Kolkata, Darjeeling)"
                  className="w-full bg-transparent text-sm text-white placeholder-bengal-100/40 focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full md:w-auto px-6 py-3 rounded-xl md:rounded-full bg-gradient-to-r from-saffron-500 to-sindoor-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-saffron-500/30 hover:opacity-95 transition-all shrink-0">
                Plan My Trip <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button onClick={() => navigate('/planner?city=Kolkata')} className="px-5 py-2.5 rounded-xl glass-card text-xs font-bold text-bengal-100 hover:text-white border border-saffron-700/30 hover:border-saffron-500/50 transition-all flex items-center gap-2">
                <Flame className="w-4 h-4 text-saffron-400" /> Try AI Planner Demo
              </button>
              <button onClick={() => navigate('/explore')} className="px-5 py-2.5 rounded-xl glass-card text-xs font-bold text-bengal-100/80 hover:text-white border border-saffron-700/20 hover:border-saffron-700/40 transition-all flex items-center gap-2">
                <Compass className="w-4 h-4 text-mustard-400" /> Explore Destinations
              </button>
            </div>

            {/* 3 highlight cards */}
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              {[
                { icon: Sparkles, color: 'text-saffron-400', bg: 'bg-saffron-500/10', title: 'Instant AI Itineraries', desc: 'Day-by-day tailored routes with cost & time optimization.' },
                { icon: Gem,      color: 'text-mustard-400', bg: 'bg-mustard-500/10', title: 'Offbeat Hidden Gems',   desc: 'Discover untamed local spots away from typical crowds.' },
                { icon: ShieldCheck, color: 'text-sindoor-400', bg: 'bg-sindoor-500/10', title: 'Safety & Weather',  desc: 'Real-time alerts, crowd levels & emergency SOS beacon.' },
              ].map(({ icon: Icon, color, bg, title, desc }, i) => (
                <div key={i} className="glass-card p-4 rounded-2xl border border-saffron-700/20 flex items-start gap-3 shadow-lg">
                  <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{title}</h4>
                    <p className="text-[11px] text-bengal-100/50 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature Grid ── */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="flex justify-center gap-2 text-saffron-500/50 text-sm">✦ ❋ ✦</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Everything You Need For A Perfect Journey</h2>
            <p className="text-xs sm:text-sm text-bengal-100/50">Powered by intelligent AI to make travel effortless, safe, and deeply immersive.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'AI Trip Planner',        desc: 'Customized itineraries with day-by-day timing, budget split, and transport modes.', icon: Sparkles,   color: 'text-saffron-400', bg: 'bg-saffron-500/10',  border: 'border-saffron-500/20', to: '/planner' },
              { title: 'Hidden Gems',            desc: 'Handpicked offbeat spots with local stories, crowd meters, and safety scores.',     icon: Gem,         color: 'text-mustard-400', bg: 'bg-mustard-500/10',  border: 'border-mustard-500/20', to: '/gems' },
              { title: 'Smart Budget Planner',   desc: 'Dynamic cost calculator dividing budget across stay, food, activities & emergency.',icon: Wallet,      color: 'text-green-400',   bg: 'bg-green-500/10',    border: 'border-green-500/20',   to: '/budget' },
              { title: 'Weather & Safety Alerts',desc: 'Live weather advisories, rain probabilities, and instant 1-click Emergency SOS.',  icon: ShieldCheck, color: 'text-sindoor-400', bg: 'bg-sindoor-500/10',  border: 'border-sindoor-500/20', to: '/weather' },
              { title: 'AI Travel Assistant',    desc: '24/7 conversational chatbot answering packing, transport, and safety questions.',  icon: Bot,         color: 'text-saffron-300', bg: 'bg-saffron-500/8',   border: 'border-saffron-500/15', to: '/assistant' },
              { title: 'Language Translator',    desc: 'Travel phrasebook with phonetic pronunciation and quick text translation.',        icon: Languages,   color: 'text-mustard-300', bg: 'bg-mustard-500/8',   border: 'border-mustard-500/15', to: '/translator' },
              { title: 'Local Culture & Stories',desc: 'Immersive regional legends, heritage history, festivals, and dining etiquette.',   icon: BookOpen,    color: 'text-orange-400',  bg: 'bg-orange-500/10',   border: 'border-orange-500/20',  to: '/culture' },
              { title: 'Transport Navigator',    desc: 'Compares Metro, Buses, Cabs & Ferries with Fastest vs. Best Budget badges.',      icon: Bus,         color: 'text-amber-400',   bg: 'bg-amber-500/10',    border: 'border-amber-500/20',   to: '/transport' },
            ].map(({ title, desc, icon: Icon, color, bg, border, to }, idx) => (
              <button key={idx} onClick={() => navigate(to)} className={`glass-card glass-card-hover p-5 rounded-2xl border ${border} space-y-3 text-left`}>
                <div className={`w-10 h-10 rounded-xl ${bg} border ${border} ${color} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
                <h3 className="text-sm font-bold text-white">{title}</h3>
                <p className="text-xs text-bengal-100/50 leading-relaxed">{desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="max-w-5xl mx-auto px-4 py-12 rounded-3xl glass-panel border border-saffron-700/25 text-center relative overflow-hidden kantha-bg">
          <div className="absolute top-4 left-4 text-saffron-500/20 text-2xl">❋</div>
          <div className="absolute top-4 right-4 text-saffron-500/20 text-2xl">❋</div>
          <div className="absolute bottom-4 left-4 text-sindoor-500/20 text-2xl">❋</div>
          <div className="absolute bottom-4 right-4 text-sindoor-500/20 text-2xl">❋</div>

          <div className="max-w-xl mx-auto mb-10 space-y-3">
            <div className="flex justify-center gap-2 text-saffron-500/50 text-sm">✦ ❋ ✦</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How TravelGenie Works</h2>
            <p className="text-xs text-bengal-100/50">Four simple steps to your tailored travel itinerary.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
            {[
              { step: '০১', title: 'বলুন',        desc: 'Enter destination, travel dates, budget, and style preferences.' },
              { step: '০২', title: 'AI Plans',    desc: 'Engine generates tailored day-by-day routes with budget splits.' },
              { step: '০৩', title: 'Explore',     desc: 'Discover hidden gems, cultural stories, and local food spots.' },
              { step: '০৪', title: 'Travel Safe', desc: 'Navigate using transport guides & live weather/safety alerts.' },
            ].map((st, idx) => (
              <div key={idx} className="space-y-2 p-4 rounded-2xl bg-bengal-900/60 border border-saffron-700/20">
                <span className="text-2xl font-black text-gradient font-mono">{st.step}</span>
                <h3 className="text-sm font-bold text-white">{st.title}</h3>
                <p className="text-[11px] text-bengal-100/50">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why TravelGenie ── */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="flex gap-2 text-saffron-500/50 text-sm">✦ ❋ ✦</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why Choose TravelGenie?</h2>
              <p className="text-xs sm:text-sm text-bengal-100/70 leading-relaxed">
                A dynamic AI companion that adapts to your travel budget, style, and real-time environment — with deep roots in Bengali culture.
              </p>
              <div className="space-y-3">
                {[
                  'Personalized recommendations for solo, couple, or family travel.',
                  'Real-time weather advisories and safety monitoring.',
                  'Budget-aware planning with intelligent expense allocation.',
                  'Deep local cultural stories, traditions, and etiquette guides.',
                  'Public transit routing comparing fastest vs. cheapest options.',
                  '1-Click Emergency SOS beacon with live GPS broadcast.',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-bengal-100/80">
                    <CheckCircle2 className="w-4 h-4 text-saffron-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/planner?city=Kolkata')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-sindoor-500 text-white font-bold text-xs shadow-lg shadow-saffron-500/25 hover:opacity-95 transition-all">
                Start Planning Free Now
              </button>
            </div>

            {/* Live preview card */}
            <div className="rounded-3xl glass-card p-6 border border-saffron-700/25 space-y-4 shadow-2xl puja-glow">
              <div className="flex items-center justify-between border-b border-saffron-700/20 pb-3">
                <span className="text-xs font-bold text-saffron-400 flex items-center gap-1.5"><Flame className="w-4 h-4" /> Live AI Preview</span>
                <span className="text-[10px] text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full font-semibold">Kolkata Itinerary</span>
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { time: '09:00 AM', place: 'Victoria Memorial',       note: 'Low crowds • Yellow Taxi / Metro', cost: '₹50' },
                  { time: '01:00 PM', place: 'Authentic Bengali Lunch', note: 'Kathi Rolls & Kosha Mangsho',      cost: '₹450' },
                  { time: '05:00 PM', place: 'Kumartuli (Hidden Gem)',  note: 'Clay artisan quarter • Offbeat',   cost: 'Free' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-bengal-900/80 border border-saffron-700/20 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{item.time} — {item.place}</h4>
                      <p className="text-[11px] text-bengal-100/50">{item.note}</p>
                    </div>
                    <span className="text-saffron-400 font-bold">{item.cost}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] text-bengal-100/50 border-t border-saffron-700/15">
                <span>Sustainability: <strong className="text-saffron-400">88/100</strong></span>
                <span>Local Experience: <strong className="text-mustard-400">94/100</strong></span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AuthModal      isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <EmergencyModal isOpen={sosOpen}  onClose={() => setSosOpen(false)} />
    </div>
  );
}
