const { generateItineraryAI, optimizeItineraryAI, answerAIChat } = require('../services/aiService');
const { getTransportOptions } = require('../services/transportService');
const { getWeatherAndSafety } = require('../services/weatherService');
const { mockDestinations, mockCultureStories, mockEvents, mockPhrases } = require('../data/mockData');
const { calculateBudget } = require('../controllers/budgetController');

async function testAll() {
  console.log('Testing Mock Data...');
  if (!mockDestinations.length) throw new Error('mockDestinations empty');
  if (!mockCultureStories.length) throw new Error('mockCultureStories empty');
  if (!mockEvents.length) throw new Error('mockEvents empty');
  if (!mockPhrases.length) throw new Error('mockPhrases empty');
  console.log('✅ Mock data verified (', mockDestinations.length, 'destinations)');

  console.log('Testing Itinerary AI Service...');
  const trip = await generateItineraryAI({ destination: 'Kolkata', days: 3, travelers: '2 Travelers', interests: ['Culture'] });
  if (!trip || !trip.days || !trip.days.length) throw new Error('generateItineraryAI failed');
  console.log('✅ Itinerary AI verified (', trip.days.length, 'days, budget ₹' + trip.customBudget + ')');

  console.log('Testing AI Chatbot...');
  const chat = await answerAIChat('Where to eat in Kolkata?');
  if (!chat || !chat.reply) throw new Error('answerAIChat failed');
  console.log('✅ AI Chat verified (', chat.reply.slice(0, 40) + '...)');

  console.log('Testing Transport Routing...');
  const transport = await getTransportOptions('Victoria Memorial', 'Howrah');
  if (!transport || !transport.options.length) throw new Error('getTransportOptions failed');
  console.log('✅ Transport Routing verified (', transport.options.length, 'modes available)');

  console.log('Testing Weather & Safety Service...');
  const weather = await getWeatherAndSafety('Kolkata');
  if (!weather || !weather.temperature) throw new Error('getWeatherAndSafety failed');
  console.log('✅ Weather Service verified (', weather.city, weather.temperature, weather.condition, ')');

  console.log('🎉 ALL BACKEND CONTROLLER & SERVICE TESTS PASSED');
}

testAll().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
