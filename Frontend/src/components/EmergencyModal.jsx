import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, MapPin, Share2, Hospital, Shield, X, Check } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShareLocation = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl glass-panel bg-slate-900 border border-rose-500/40 p-6 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Emergency SOS Panel</h3>
              <p className="text-xs text-rose-400 font-semibold">Immediate Assistance & Contacts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location Share Button */}
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Current GPS Location</span>
            </div>
            <span className="text-[10px] text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded-full">
              Live Verified
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono mb-3">
            Lat: 22.5448° N, Lng: 88.3426° E (Near Victoria Memorial, Kolkata)
          </p>
          <button
            onClick={handleShareLocation}
            className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Emergency Beacon Sent!' : 'Share My Live Location to Emergency Contacts'}
          </button>
        </div>

        {/* Helplines List */}
        <div className="space-y-2 mb-6">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">
            24x7 Official Helpline Numbers
          </p>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Police Control Room</span>
            </div>
            <a href="tel:100" className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-bold hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> 100 / 112
            </a>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
              <Hospital className="w-4 h-4 text-rose-400" />
              <span>Medical Ambulance</span>
            </div>
            <a href="tel:102" className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> 102 / 108
            </a>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
              <ShieldAlert className="w-4 h-4 text-teal-400" />
              <span>Tourist Multi-lingual Helpline</span>
            </div>
            <a href="tel:1363" className="px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 text-xs font-bold hover:bg-teal-500 hover:text-white transition-colors flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> 1363
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
}
