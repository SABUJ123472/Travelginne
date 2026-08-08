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

// Memory fallback user state for demo mode
let memoryUser = {
  geniePoints: 850,
  travelerRank: 'Gold Trailblazer',
  badges: ['Culture Maestro', 'Heritage Explorer', 'Hidden Gem Hunter'],
  checkIns: [
    { placeName: 'Victoria Memorial', city: 'Kolkata', pointsEarned: 100, isHiddenGem: false, checkInTime: new Date(Date.now() - 86400000 * 3) },
    { placeName: 'Kumartuli Artisan Village', city: 'Kolkata', pointsEarned: 250, isHiddenGem: true, checkInTime: new Date(Date.now() - 86400000 * 2) },
    { placeName: 'Eiffel Tower', city: 'Paris', pointsEarned: 100, isHiddenGem: false, checkInTime: new Date(Date.now() - 86400000 * 1) },
  ],
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

// 2. Claim Daily Bonus (+50 pts)
const claimDailyBonus = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'demo_user_1';
    const isConnected = getIsConnected();
    const bonusPoints = 50;

    let totalPoints = 0;
    let travelerRank = 'Bronze Explorer';

    if (isConnected && isValidObjectId(userId)) {
      const userObj = await User.findById(userId);
      if (userObj) {
        userObj.geniePoints = (userObj.geniePoints || 0) + bonusPoints;
        userObj.travelerRank = calculateRank(userObj.geniePoints);
        await userObj.save();
        totalPoints = userObj.geniePoints;
        travelerRank = userObj.travelerRank;
      }
    } else {
      memoryUser.geniePoints += bonusPoints;
      memoryUser.travelerRank = calculateRank(memoryUser.geniePoints);
      totalPoints = memoryUser.geniePoints;
      travelerRank = memoryUser.travelerRank;
    }

    return res.json({
      success: true,
      message: 'Daily check-in bonus claimed! +50 GeniePoints earned.',
      pointsEarned: bonusPoints,
      totalPoints,
      travelerRank
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
    const userId = req.user ? req.user.id : 'demo_user_1';
    const isConnected = getIsConnected();

    let stats = {
      geniePoints: memoryUser.geniePoints,
      travelerRank: memoryUser.travelerRank,
      badges: memoryUser.badges,
      checkInsCount: memoryUser.checkIns.length,
      checkIns: memoryUser.checkIns,
      nextRankPoints: getNextRankThreshold(memoryUser.geniePoints)
    };

    if (isConnected && isValidObjectId(userId)) {
      const u = await User.findById(userId);
      if (u) {
        stats = {
          geniePoints: u.geniePoints || 350,
          travelerRank: u.travelerRank || 'Silver Voyager',
          badges: u.badges && u.badges.length > 0 ? u.badges : ['Bronze Explorer'],
          checkInsCount: u.checkIns ? u.checkIns.length : 0,
          checkIns: u.checkIns || [],
          nextRankPoints: getNextRankThreshold(u.geniePoints || 350)
        };
      }
    }

    return res.json({ success: true, stats });
  } catch (error) {
    console.error('User stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user rewards stats.' });
  }
};

module.exports = {
  checkInPlace,
  claimDailyBonus,
  getLeaderboard,
  getUserStats
};
