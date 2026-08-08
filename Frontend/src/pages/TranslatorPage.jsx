import React, { useState, useEffect } from 'react';
import { Languages, Volume2, Copy, Check, ArrowRightLeft, Sparkles, RefreshCw, BookOpen } from 'lucide-react';
import { translatorService } from '../services/api';

const LANGUAGES = [
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'it', name: 'Italian (Italiano)' },
];

export default function TranslatorPage() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('bn');
  const [text, setText]             = useState('');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading]       = useState(false);
  const [copied, setCopied]         = useState(false);

  const [phrases, setPhrases] = useState([]);

  useEffect(() => {
    translatorService.getPhrases(targetLang).then(res => {
      if (res.data.success) setPhrases(res.data.phrases || []);
    }).catch(() => {});
  }, [targetLang]);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await translatorService.translate({ text, sourceLang, targetLang });
      if (res.data.success) {
        setTranslated(res.data.translatedText);
      }
    } catch (err) {
      setTranslated('Translation currently unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translated) return;
    navigator.clipboard.writeText(translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(translated);
    setTranslated(text);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
            MULTILINGUAL ENGINE
          </span>
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-bengali">
            বহুভাষিক অনুবাদক
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900">
          Real-time AI Translator & Phrasebook
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Translate travel queries, local directions, and dining requests seamlessly into regional languages.
        </p>
      </div>

      {/* Translator Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-6">
        
        {/* Language Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#f5efe6] border border-[#e2dad0]">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white border border-[#e2dad0] text-xs font-bold text-stone-900 focus:outline-none"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>

          <button
            onClick={handleSwap}
            className="p-2.5 rounded-xl bg-white border border-[#e2dad0] text-[#c85a44] hover:bg-[#fff0ed] transition-colors"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white border border-[#e2dad0] text-xs font-bold text-stone-900 focus:outline-none"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Text Input & Output Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Input Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Original Text</label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste travel text here (e.g. How do I reach Victoria Memorial?)..."
              className="w-full p-4 rounded-2xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52] resize-none font-medium"
            />
          </div>

          {/* Translation Result Area */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#c85a44] uppercase tracking-wider block">Translation</label>
              {translated && (
                <button
                  onClick={handleCopy}
                  className="text-xs font-bold text-stone-600 hover:text-[#c85a44] flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="w-full min-h-[125px] p-4 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] text-xs font-bold text-stone-900 leading-relaxed">
              {loading ? (
                <div className="flex items-center gap-2 text-[#c85a44] animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Translating...
                </div>
              ) : translated ? (
                <p className="text-sm font-heritage">{translated}</p>
              ) : (
                <span className="text-stone-400 font-normal">Translation output will appear here...</span>
              )}
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          className="w-full py-3.5 rounded-2xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
          <span>Translate Text</span>
        </button>

      </div>

      {/* Common Essential Travel Phrases */}
      {phrases && phrases.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] space-y-4 shadow-sm">
          <h3 className="text-lg font-heritage font-extrabold text-stone-900 border-b border-[#e2dad0] pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#c85a44]" />
            <span>Essential Travel Phrasebook</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {phrases.map((p, idx) => (
              <div
                key={idx}
                onClick={() => { setText(p.original); setTranslated(p.translated); }}
                className="p-3.5 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] hover:border-[#c85a44] transition-all cursor-pointer space-y-1 shadow-sm"
              >
                <span className="text-[10px] font-bold text-[#c85a44] uppercase">{p.category || 'Essential'}</span>
                <p className="font-bold text-stone-900">{p.original}</p>
                <p className="text-stone-600 font-medium italic">{p.translated}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
