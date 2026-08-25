import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Flame, CheckCircle2, Award, Clock } from 'lucide-react';
import { rewardService } from '../services/api';

const STORAGE_KEY = 'tg_daily_claim_next';

function useCountdown(targetIso) {
  const [msLeft, setMsLeft] = useState(0);

  useEffect(() => {
    if (!targetIso) { setMsLeft(0); return; }
    const tick = () => {
      const diff = new Date(targetIso) - Date.now();
      setMsLeft(Math.max(0, diff));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const h = Math.floor(msLeft / 3600000);
  const m = Math.floor((msLeft % 3600000) / 60000);
  const s = Math.floor((msLeft % 60000) / 1000);
  return { msLeft, label: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` };
}

export default function LeaderboardRewardsPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats]     = useState(null);
  const [loading, setLoading]         = useState(true);
  const [nextClaimAt, setNextClaimAt] = useState(() => localStorage.getItem(STORAGE_KEY) || null);
  const [bonusToast, setBonusToast]   = useState(null);

  const { msLeft, label: countdownLabel } = useCountdown(nextClaimAt);
  const onCooldown = msLeft > 0;

  const fetchRewardData = async () => {
    setLoading(true);
    try {
      const [lbRes, statsRes] = await Promise.allSettled([
        rewardService.getLeaderboard(),
        rewardService.getUserStats()
      ]);
      if (lbRes.status === 'fulfilled' && lbRes.value.data.success) {
        setLeaderboard(lbRes.value.data.leaderboard || []);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setUserStats(statsRes.value.data.stats || statsRes.value.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardData();
    // Restore cooldown from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && new Date(stored) > new Date()) {
      setNextClaimAt(stored);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setNextClaimAt(null);
    }
  }, []);

  const handleCheckIn = async () => {
    if (onCooldown) return;
    try {
      const res = await rewardService.claimDailyBonus();
      if (res.data.success) {
        // Save nextClaimAt to localStorage for persistence across page refreshes
        if (res.data.nextClaimAt) {
          localStorage.setItem(STORAGE_KEY, res.data.nextClaimAt);
          setNextClaimAt(res.data.nextClaimAt);
        }
        setBonusToast({ pts: res.data.pointsEarned || 50, total: res.data.totalPoints, rank: res.data.travelerRank });
        setTimeout(() => setBonusToast(null), 4000);
        fetchRewardData();
      }
    } catch (err) {
      // Handle 429 — already claimed
      const data = err?.response?.data;
      if (data?.alreadyClaimed && data?.nextClaimAt) {
        localStorage.setItem(STORAGE_KEY, data.nextClaimAt);
        setNextClaimAt(data.nextClaimAt);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16 relative">

      {/* Daily Bonus Toast */}
      {bonusToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#19232d] text-white shadow-2xl border border-emerald-500">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-base shrink-0">🔥</div>
          <div>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Daily Bonus Claimed!</p>
            <p className="text-sm font-extrabold">+{bonusToast.pts} GeniePoints → {bonusToast.total} Total</p>
            <p className="text-[10px] text-stone-400 font-medium">{bonusToast.rank}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
            EXPLORER REWARDS & RANK
          </span>
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
            পুরস্কার ও লিডারবোর্ড
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900">
          Explorer Leaderboard & Points Ledger
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Earn Explorer Points by cataloging trips, logging daily check-ins, and uncovering hidden gems around the world.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* User Rank */}
        <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Explorer Rank</span>
            <Trophy className="w-5 h-5 text-[#c85a44]" />
          </div>
          <div>
            <div className="text-2xl font-heritage font-extrabold text-stone-900">
              {userStats?.rank || userStats?.travelerRank || 'Bronze Explorer'}
            </div>
            <p className="text-xs text-stone-600 font-medium mt-1">Earn points to level up your rank</p>
          </div>
        </div>

        {/* Total Points */}
        <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Explorer Points</span>
            <Award className="w-5 h-5 text-[#c85a44]" />
          </div>
          <div>
            <div className="text-3xl font-heritage font-extrabold text-stone-900">
              {(userStats?.points ?? userStats?.geniePoints ?? 0)} PTS
            </div>
            <p className="text-xs text-stone-600 font-medium mt-1">Generate trips to earn more points</p>
          </div>
        </div>

        {/* Daily Check-in Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-3 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Daily Streak</span>
            <Flame className="w-5 h-5 text-[#c85a44]" />
          </div>

          {onCooldown ? (
            <div className="space-y-2">
              {/* Countdown Timer Display */}
              <div className="w-full py-2.5 rounded-xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-1.5 text-stone-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Next Claim In</span>
                </div>
                <span className="text-xl font-mono font-extrabold text-stone-800 tracking-widest">
                  {countdownLabel}
                </span>
              </div>
              <p className="text-[10px] text-center text-stone-400 font-medium">
                Come back tomorrow for +50 pts!
              </p>
            </div>
          ) : (
            <button
              onClick={handleCheckIn}
              className="w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm bg-[#c85a44] text-white hover:bg-[#a54431] active:scale-95"
            >
              <Flame className="w-4 h-4" />
              <span>Claim Daily Check-in Bonus (+50 PTS)</span>
            </button>
          )}
        </div>

      </div>

      {/* Leaderboard Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] space-y-5 shadow-sm">
        <h3 className="text-xl font-heritage font-extrabold text-stone-900 border-b border-[#e2dad0] pb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#c85a44]" />
          <span>Top Global Explorers</span>
        </h3>

        {loading ? (
          <div className="py-8 text-center text-xs text-[#c85a44] font-bold">Loading leaderboard rankings...</div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold transition-all ${
                  item.isCurrentUser
                    ? 'bg-[#fff0ed] border-[#c85a44] shadow-sm'
                    : 'bg-[#f5efe6] border-[#e2dad0]'
                } text-stone-800`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                    idx === 0 ? 'bg-[#c85a44] text-white' : idx === 1 ? 'bg-stone-800 text-white' : idx === 2 ? 'bg-amber-500 text-white' : 'bg-[#e2dad0] text-stone-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-bold text-stone-900">
                    {item.name || item.username}{item.isCurrentUser ? ' 👤' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-stone-600 hidden sm:block">{item.rank || 'Explorer'}</span>
                  <strong className="text-[#c85a44] font-mono text-sm">{item.points} PTS</strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-stone-500 font-medium">No leaderboard data available.</div>
        )}
      </div>

    </div>
  );
}
