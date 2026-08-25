const User = require('../models/User');
const { getIsConnected } = require('../config/db');

// Seed leaderboard travelers if database has few entries
const SEED_TRAVELERS = [
  { name: 'Sophia Chen', geniePoints: 2850, travelerRank: 'Platinum Legend', checkIns: new Array(18), badges: ['Hidden Gem Hunter', 'Heritage Specialist', 'Global Pioneer'], avatar: 'S' },
  { name: 'Arjun Patel', geniePoints: 1920, travelerRank: 'Gold Trailblazer', checkIns: new Array(14), badges: ['Heritage Specialist', 'Eco Explorer'], avatar: 'A' },
  { name: 'Elena Rostova', geniePoints: 1450, travelerRank: 'Gold Trailblazer', checkIns: new Array(11), badges: ['Culture Maestro', 'Offbeat Adventurer'], avatar: 'E' },
  { name: 'Marcus Vance', geniePoints: 720, travelerRank: 'Silver Voyager', checkIns: new Array(6), badges: ['Silver Explorer'], avatar: 'M' },
  { name: 'Aarav Sharma', geniePoints: 480, travelerRank: 'Silver Voyager', checkIns: new Array(4), badges: ['Heritage Explorer'], avatar: 'A' },
];

const calculateRank = (points) => {
  if (points >= 2000) return 'Platinum Legend';
  if (points >= 800) return 'Gold Trailblazer';
  if (points >= 300) return 'Silver Voyager';
  return 'Bronze Explorer';
};

const getNextRankThreshold = (points) => {
  if (points >= 2000) return 5000;
  if (points >= 800) return 2000;
  if (points >= 300) return 800;
  return 300;
};

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

// Memory fallback user state for demo mode (starts fresh at 0)
let memoryUser = {
  geniePoints: 0,
  travelerRank: 'Bronze Explorer',
  badges: [],
  checkIns: [],
  lastDailyClaim: null
};

// 1. Check-In at a Location
const checkInPlace = async (req, res) => {
  try {
    const { placeId = 'place_1', placeName = 'Victoria Memorial', city = 'Kolkata', isHiddenGem = false } = req.body;
    const pointsToAdd = isHiddenGem ? 250 : 100;
    const newBadge = isHiddenGem ? 'Hidden Gem Hunter' : 'Heritage Explorer';
    const userId = req.user ? req.user.id : 'demo_user_1';
    const isConnected = getIsConnected();

    let totalPoints = 0;
    let travelerRank = 'Bronze Explorer';
    let badges = [];
    let checkInItem = { placeId, placeName, city, pointsEarned: pointsToAdd, isHiddenGem, checkInTime: new Date() };

    if (isConnected && isValidObjectId(userId)) {
      const userObj = await User.findById(userId);
      if (userObj) {
        userObj.geniePoints = (userObj.geniePoints || 0) + pointsToAdd;
        userObj.travelerRank = calculateRank(userObj.geniePoints);

        if (!userObj.badges) userObj.badges = [];
        if (!userObj.badges.includes(newBadge)) userObj.badges.push(newBadge);
        if (userObj.checkIns.length >= 5 && !userObj.badges.includes('Culture Maestro')) userObj.badges.push('Culture Maestro');
        if (userObj.checkIns.length >= 10 && !userObj.badges.includes('Global Pioneer')) userObj.badges.push('Global Pioneer');

        userObj.checkIns.unshift(checkInItem);
        await userObj.save();

        totalPoints = userObj.geniePoints;
        travelerRank = userObj.travelerRank;
        badges = userObj.badges;
      }
    } else {
      memoryUser.geniePoints += pointsToAdd;
      memoryUser.travelerRank = calculateRank(memoryUser.geniePoints);
      if (!memoryUser.badges.includes(newBadge)) memoryUser.badges.push(newBadge);
      memoryUser.checkIns.unshift(checkInItem);

      totalPoints = memoryUser.geniePoints;
      travelerRank = memoryUser.travelerRank;
      badges = memoryUser.badges;
    }

    return res.status(200).json({
      success: true,
      message: `Checked in at ${placeName}! Earned +${pointsToAdd} GeniePoints.`,
      pointsEarned: pointsToAdd,
      totalPoints,
      travelerRank,
      badgeUnlocked: newBadge,
      badges,
      checkIn: checkInItem
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({ success: false, message: 'Check-in failed.' });
  }
};

// 2. Claim Daily Bonus (+50 pts) — 24-hour cooldown enforced
const claimDailyBonus = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const isConnected = getIsConnected();
    const bonusPoints = 50;
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const now = new Date();

    let totalPoints = 0;
    let travelerRank = 'Bronze Explorer';
    let nextClaimAt = null;

    if (isConnected && userId && isValidObjectId(userId)) {
      const userObj = await User.findById(userId);
      if (!userObj) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      // Check 24hr cooldown
      if (userObj.lastDailyClaim) {
        const elapsed = now - new Date(userObj.lastDailyClaim);
        if (elapsed < TWENTY_FOUR_HOURS) {
          const msRemaining = TWENTY_FOUR_HOURS - elapsed;
          nextClaimAt = new Date(now.getTime() + msRemaining).toISOString();
          return res.status(429).json({
            success: false,
            alreadyClaimed: true,
            message: 'Daily bonus already claimed. Come back in 24 hours.',
            nextClaimAt,
            msRemaining: Math.floor(msRemaining)
          });
        }
      }

      // Award bonus
      userObj.geniePoints = (userObj.geniePoints || 0) + bonusPoints;
      userObj.travelerRank = calculateRank(userObj.geniePoints);
      userObj.lastDailyClaim = now;
      await userObj.save();
      totalPoints = userObj.geniePoints;
      travelerRank = userObj.travelerRank;
      nextClaimAt = new Date(now.getTime() + TWENTY_FOUR_HOURS).toISOString();

    } else {
      // In-memory fallback with 24hr cooldown
      if (memoryUser.lastDailyClaim) {
        const elapsed = now - new Date(memoryUser.lastDailyClaim);
        if (elapsed < TWENTY_FOUR_HOURS) {
          const msRemaining = TWENTY_FOUR_HOURS - elapsed;
          nextClaimAt = new Date(now.getTime() + msRemaining).toISOString();
          return res.status(429).json({
            success: false,
            alreadyClaimed: true,
            message: 'Daily bonus already claimed. Come back in 24 hours.',
            nextClaimAt,
            msRemaining: Math.floor(msRemaining)
          });
        }
      }

      memoryUser.geniePoints += bonusPoints;
      memoryUser.travelerRank = calculateRank(memoryUser.geniePoints);
      memoryUser.lastDailyClaim = now;
      totalPoints = memoryUser.geniePoints;
      travelerRank = memoryUser.travelerRank;
      nextClaimAt = new Date(now.getTime() + TWENTY_FOUR_HOURS).toISOString();
    }

    return res.json({
      success: true,
      message: 'Daily check-in bonus claimed! +50 GeniePoints earned.',
      pointsEarned: bonusPoints,
      totalPoints,
      travelerRank,
      nextClaimAt
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Daily bonus claim failed.' });
  }
};


// 3. Get Global Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const isConnected = getIsConnected();
    const currentUserId = req.user ? req.user.id : null;
    let list = [];

    if (isConnected) {
      const users = await User.find().select('name geniePoints travelerRank checkIns badges').sort({ geniePoints: -1 }).limit(15);
      list = users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        points: u.geniePoints || 350,
        rank: u.travelerRank || 'Silver Voyager',
        checkInsCount: u.checkIns ? u.checkIns.length : 0,
        badges: u.badges && u.badges.length > 0 ? u.badges : ['Traveler'],
        avatar: u.name ? u.name[0].toUpperCase() : 'U',
        isCurrentUser: currentUserId && u._id.toString() === currentUserId.toString()
      }));
    }

    // Merge seed travelers if fewer than 5 real users
    if (list.length < 5) {
      const seedFormatted = SEED_TRAVELERS.map((s, idx) => ({
        id: `seed_${idx}`,
        name: s.name,
        points: s.geniePoints,
        rank: s.travelerRank,
        checkInsCount: s.checkIns.length,
        badges: s.badges,
        avatar: s.avatar,
        isCurrentUser: false
      }));

      // Add current memory user if not connected or not in list
      const meFound = list.some(u => u.isCurrentUser);
      if (!meFound) {
        list.push({
          id: 'me_demo',
          name: req.user?.name ? `${req.user.name} (You)` : 'You (Traveler)',
          points: memoryUser.geniePoints,
          rank: memoryUser.travelerRank,
          checkInsCount: memoryUser.checkIns.length,
          badges: memoryUser.badges,
          avatar: req.user?.name ? req.user.name[0].toUpperCase() : 'Y',
          isCurrentUser: true
        });
      }

      list = [...list, ...seedFormatted];
    }

    // Sort by points descending and add rank position
    list.sort((a, b) => b.points - a.points);
    list = list.map((u, idx) => ({ ...u, rankPosition: idx + 1 }));

    return res.json({ success: true, count: list.length, leaderboard: list });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' });
  }
};

// 4. Get User Rewards Stats & Recent Check-Ins
const getUserStats = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const isConnected = getIsConnected();

    // Default fresh user stats
    let stats = {
      geniePoints: 0,
      points: 0,
      travelerRank: 'Bronze Explorer',
      rank: 'Bronze Explorer',
      badges: [],
      checkInsCount: 0,
      checkIns: [],
      nextRankPoints: 300
    };

    if (isConnected && userId && isValidObjectId(userId)) {
      const u = await User.findById(userId);
      if (u) {
        const pts = u.geniePoints || 0;
        const rankLabel = u.travelerRank || calculateRank(pts);
        stats = {
          geniePoints: pts,
          points: pts,
          travelerRank: rankLabel,
          rank: rankLabel,
          badges: u.badges && u.badges.length > 0 ? u.badges : [],
          checkInsCount: u.checkIns ? u.checkIns.length : 0,
          checkIns: u.checkIns || [],
          nextRankPoints: getNextRankThreshold(pts)
        };
      }
    } else {
      // In-memory fallback
      const pts = memoryUser.geniePoints;
      const rankLabel = memoryUser.travelerRank;
      stats = {
        geniePoints: pts,
        points: pts,
        travelerRank: rankLabel,
        rank: rankLabel,
        badges: memoryUser.badges,
        checkInsCount: memoryUser.checkIns.length,
        checkIns: memoryUser.checkIns,
        nextRankPoints: getNextRankThreshold(pts)
      };
    }

    return res.json({ success: true, stats });
  } catch (error) {
    console.error('User stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user rewards stats.' });
  }
};

// 5. Award +50 points when user generates an itinerary / reaches a destination
const awardDestinationPoints = async (req, res) => {
  try {
    const { destination = 'Unknown Destination' } = req.body;
    const userId = req.user ? (req.user.id || req.user._id) : null;
    const isConnected = getIsConnected();
    const pointsToAdd = 50;
    const badge = 'Expedition Planner';

    let totalPoints = 0;
    let travelerRank = 'Bronze Explorer';
    let badges = [];

    if (isConnected && userId && isValidObjectId(String(userId))) {
      const userObj = await User.findById(userId);
      if (userObj) {
        userObj.geniePoints = (userObj.geniePoints || 0) + pointsToAdd;
        userObj.travelerRank = calculateRank(userObj.geniePoints);
        if (!userObj.badges) userObj.badges = [];
        if (!userObj.badges.includes(badge)) userObj.badges.push(badge);
        if (userObj.checkIns.length >= 3 && !userObj.badges.includes('Culture Maestro')) userObj.badges.push('Culture Maestro');
        if (userObj.checkIns.length >= 7 && !userObj.badges.includes('Global Pioneer')) userObj.badges.push('Global Pioneer');
        userObj.checkIns.unshift({
          placeName: destination,
          city: destination,
          pointsEarned: pointsToAdd,
          isHiddenGem: false,
          checkInTime: new Date()
        });
        await userObj.save();
        totalPoints = userObj.geniePoints;
        travelerRank = userObj.travelerRank;
        badges = userObj.badges;
      }
    } else {
      memoryUser.geniePoints += pointsToAdd;
      memoryUser.travelerRank = calculateRank(memoryUser.geniePoints);
      if (!memoryUser.badges.includes(badge)) memoryUser.badges.push(badge);
      memoryUser.checkIns.unshift({
        placeName: destination,
        city: destination,
        pointsEarned: pointsToAdd,
        isHiddenGem: false,
        checkInTime: new Date()
      });
      totalPoints = memoryUser.geniePoints;
      travelerRank = memoryUser.travelerRank;
      badges = memoryUser.badges;
    }

    return res.status(200).json({
      success: true,
      message: `Expedition to ${destination} logged! +${pointsToAdd} GeniePoints earned.`,
      pointsEarned: pointsToAdd,
      totalPoints,
      travelerRank,
      badges
    });
  } catch (error) {
    console.error('Award destination points error:', error);
    return res.status(500).json({ success: false, message: 'Failed to award destination points.' });
  }
};

module.exports = {
  checkInPlace,
  claimDailyBonus,
  getLeaderboard,
  getUserStats,
  awardDestinationPoints
};
