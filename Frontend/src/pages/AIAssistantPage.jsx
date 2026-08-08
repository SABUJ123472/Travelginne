import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, MessageSquare, Trash2, Copy, Check, ShieldCheck, Compass, Utensils, Wallet, Bus } from 'lucide-react';
import { assistantService } from '../services/api';

const QUICK_PROMPTS = [
  { label: '🏛️ Top Attractions', query: 'What are the top attractions and heritage monuments to visit in Kolkata?' },
  { label: '🍲 Local Street Food', query: 'What authentic street food and local dishes should I try?' },
  { label: '💰 Budget Travel Hacks', query: 'How can I travel efficiently on a budget with public transit?' },
  { label: '🛡️ Safety & Advisories', query: 'What safety precautions and emergency contact tips should I know?' },
  { label: '🧳 Packing Checklist', query: 'What essential items and tech should I pack for my trip?' },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Namaskar! I'm TravelGenie AI, your intelligent travel assistant agent. Ask me anything about attractions, local food, budget itineraries, safety advisories, or transit routes for any destination worldwide!",
      suggestions: [
        "What should I visit in Kolkata?",
        "Top attractions in Tokyo & Paris",
        "Must-try local street food",
        "Budget travel tips & transit",
        "Is it safe to travel today?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await assistantService.chat({ message: query, history: updatedMessages });
      if (res.data.success) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: res.data.reply,
            suggestions: res.data.suggestions
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `For **"${query}"**, TravelGenie AI recommends starting early morning at iconic heritage landmarks, taking local public transit, and sampling regional delicacies. Check out the AI Trip Planner for a full multi-day itinerary!`,
          suggestions: ["Must-try street food", "Safety advisories", "Budget travel tips"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (txt, idx) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        sender: 'bot',
        text: "Chat history cleared. How can I assist your next journey?",
        suggestions: ["Top attractions in Tokyo", "What food should I try?", "Budget travel tips"]
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#070a14] via-rose-950/30 to-[#070a14] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/30">
            <Bot className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="font-bengali">২৪x৭ এআই ভ্রমণ সহকারী</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-heritage font-extrabold text-white">TravelGenie AI Agent</h1>
            <p className="text-xs text-amber-100/80">
              Multi-turn conversational AI agent for world destinations, itinerary planning, street food, and safety.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          title="Clear Chat History"
          className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Quick Prompt Category Chips */}
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.query)}
            className="px-3.5 py-2 rounded-xl bg-[#070a14] border border-amber-500/20 text-amber-200/90 text-xs font-bold hover:text-white hover:border-rose-500/50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="glass-panel rounded-3xl border border-amber-500/20 p-4 sm:p-6 h-[520px] flex flex-col justify-between shadow-2xl">
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-600/30 to-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="max-w-lg space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white font-semibold rounded-br-none shadow-md shadow-rose-600/20'
                      : 'bg-[#070a14] border border-amber-500/20 text-amber-100/90 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>

                {/* Bot Message Actions */}
                {msg.sender === 'bot' && (
                  <div className="flex items-center justify-between pt-0.5">
                    {msg.suggestions && msg.suggestions.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSend(sug)}
                            className="px-2.5 py-1 rounded-full bg-[#070a14] border border-amber-500/30 text-[11px] text-amber-300 hover:bg-rose-600 hover:text-white transition-colors font-medium"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    ) : <div />}

                    <button
                      onClick={() => handleCopy(msg.text, idx)}
                      title="Copy Answer"
                      className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:text-white text-[10px] flex items-center gap-1 shrink-0 border border-amber-500/20"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold py-2">
              <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
              <span>TravelGenie AI is thinking & researching...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="pt-4 border-t border-rose-900/30 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask TravelGenie AI... (e.g. What are the best food spots in Tokyo?)"
            className="w-full px-4 py-3.5 rounded-2xl bg-[#070a14] border border-amber-500/30 text-xs text-white placeholder-amber-200/40 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-extrabold text-xs hover:opacity-90 transition-opacity shadow-md shadow-rose-600/20 disabled:opacity-50 shrink-0 flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
