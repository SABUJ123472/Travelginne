import React, { useState, useEffect } from 'react';
import { Trophy, Gift, Flame, CheckCircle2, Award, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { rewardService } from '../services/api';

export default function LeaderboardRewardsPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats]     = useState(null);
  const [loading, setLoading]         = useState(true);
  const [checkedIn, setCheckedIn]     = useState(false);
  const [bonusToast, setBonusToast]   = useState(null);

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
  }, []);

  const handleCheckIn = async () => {
    try {
      // claimDailyBonus gives exactly +50 pts
      const res = await rewardService.claimDailyBonus();
      if (res.data.success) {
        setCheckedIn(true);
        setBonusToast({ pts: res.data.pointsEarned || 50, total: res.data.totalPoints, rank: res.data.travelerRank });
        setTimeout(() => setBonusToast(null), 4000);
        fetchRewardData();
      }
    } catch (err) {}
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
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-bengali">
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

          <button
            onClick={handleCheckIn}
            disabled={checkedIn}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm ${
              checkedIn
                ? 'bg-emerald-600 text-white'
                : 'bg-[#c85a44] text-white hover:bg-[#a54431]'
            }`}
          >
            {checkedIn ? <CheckCircle2 className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
            <span>{checkedIn ? '✓ Check-in Claimed (+50 PTS)' : 'Claim Daily Check-in Bonus'}</span>
          </button>
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
                className="p-3.5 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] flex items-center justify-between text-xs font-semibold text-stone-800"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                    idx === 0 ? 'bg-[#c85a44] text-white' : idx === 1 ? 'bg-stone-800 text-white' : 'bg-[#e2dad0] text-stone-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-bold text-stone-900">{item.name || item.username}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-stone-600">{item.rank || 'Explorer'}</span>
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
