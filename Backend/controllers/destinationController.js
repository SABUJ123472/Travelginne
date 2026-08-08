const axios = require('axios');
const { mockDestinations, mockCultureStories, mockEvents } = require('../data/mockData');
const Destination = require('../models/Destination');
const { getIsConnected } = require('../config/db');

const historicalBriefs = {
  "dest_kol_3": {
    significance: "Centuries-old artisan quarter where generations of potters migrate clay from the holy Ganges River to sculpt towering idols for Durga Puja.",
    era: "18th Century (1750s onwards)",
    architecturalStyle: "Traditional Bengal Clay Craftsmanship",
    culturalFacts: "Idols crafted here are exported to Bengali communities in over 90 countries.",
    localTips: "Visit in August-September to see artisans painting intricate eyes (Chokhu Daan) of deities."
  },
  "dest_kol_4": {
    significance: "Neoclassical marble mansion built in 1835 by Raja Rajendra Mullick, housing rare Italian sculptures, Victorian paintings, and roaming peacocks.",
    era: "19th Century (1835)",
    architecturalStyle: "Neoclassical & Victorian Italian Marble",
    culturalFacts: "Contains original paintings by Rubens, Sir Joshua Reynolds, and Titian.",
    localTips: "Obtain a free entry pass from WB Tourism office before visiting."
  },
  "dest_kol_5": {
    significance: "Atmospheric 18th-century gothic cemetery opened in 1767, filled with moss-covered obelisks, mausoleums, and towering banyan roots.",
    era: "18th Century British Raj (1767)",
    architecturalStyle: "Gothic & Neoclassical Funerary Architecture",
    culturalFacts: "Final resting place of Sir William Jones (founder of Asiatic Society) and poet Henry Derozio.",
    localTips: "Best visited during 4:00 PM golden hour for serene photography."
  },
  "dest_par_3": {
    significance: "An elevated tree-lined park built atop a 19th-century railway viaduct, winding through rose gardens high above Paris city streets.",
    era: "1993 Reclaimed Railway Urban Park",
    architecturalStyle: "Elevated Linear Park Architecture",
    culturalFacts: "The world's first elevated park walkway, inspiring New York's High Line.",
    localTips: "Walk the entire 4.7 km path from Bastille to Bois de Vincennes."
  },
};

const getDestinations = async (req, res) => {
  try {
    const { category, search, budget, rating } = req.query;
    let list = [...mockDestinations];

    if (search) {
      const s = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(s) || d.city.toLowerCase().includes(s) || d.description.toLowerCase().includes(s));
    }

    if (category && category !== 'All') {
      list = list.filter(d => d.category.toLowerCase() === category.toLowerCase() || (category === 'Hidden Gem' && d.isHiddenGem));
    }

    if (rating) {
      list = list.filter(d => d.rating >= Number(rating));
    }

    if (budget) {
      list = list.filter(d => d.estimatedCost <= Number(budget));
    }

    const enhancedList = list.map(dest => {
      const brief = historicalBriefs[dest.id] || {
        significance: `${dest.name} is an underrated ${dest.category} spot in ${dest.city}.`,
        era: "Heritage Era",
        architecturalStyle: "Regional Architecture",
        culturalFacts: dest.whySpecial || "Deeply rooted in local cultural history and community traditions.",
        localTips: "Visit during off-peak morning hours for optimal photography and peaceful exploration."
      };
      const cityEvents = mockEvents.filter(e => e.city.toLowerCase().includes(dest.city.toLowerCase()));
      return { ...dest, historicalBrief: brief, cityEvents };
    });

    return res.json({ success: true, count: enhancedList.length, destinations: enhancedList });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch destinations.' });
  }
};

const getHiddenGems = async (req, res) => {
  try {
    const { city, search } = req.query;
    let gems = mockDestinations.filter(d => d.isHiddenGem);

    const queryTerm = (city || search || '').toLowerCase().trim();

    if (queryTerm && queryTerm !== 'all') {
      gems = gems.filter(d =>
        d.city.toLowerCase().includes(queryTerm) ||
        d.location.toLowerCase().includes(queryTerm) ||
        d.name.toLowerCase().includes(queryTerm) ||
        d.whySpecial?.toLowerCase().includes(queryTerm)
      );

      if (gems.length === 0 && queryTerm.length > 2) {
        const capitalCity = queryTerm.charAt(0).toUpperCase() + queryTerm.slice(1);
        gems = [
          {
            id: `dest_${queryTerm}_gem1`,
            name: `${capitalCity} Historic Heritage Quarter`,
            city: capitalCity,
            location: `Old Quarter, ${capitalCity}`,
            rating: 4.9,
            description: `A breathtaking underrated heritage alley in ${capitalCity} with ancient architecture, traditional tea shops, and zero tourist crowds.`,
            bestTimeToVisit: "Morning 8 AM - 11 AM",
            estimatedCost: 0,
            category: "Hidden Gem",
            image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80",
            isHiddenGem: true,
            whySpecial: `Preserves authentic local architecture and cultural traditions of ${capitalCity}.`,
            localStory: `Centuries-old community neighborhood celebrated by locals for peaceful evening walks.`,
            crowdLevel: "Low",
            safetyLevel: "Safe",
            nearbyAttractions: [`${capitalCity} City Center`, `${capitalCity} Market`],
            whyRecommended: `Tranquil, authentic cultural experience away from main commercial spots.`,
            coordinates: { lat: 22.5726, lng: 88.3639 }
          }
        ];
      }
    }

    const enhancedGems = gems.map(dest => ({
      ...dest,
      historicalBrief: historicalBriefs[dest.id] || {
        significance: `${dest.name} is an offbeat ${dest.category} spot in ${dest.city}.`,
        era: "Heritage Era",
        culturalFacts: dest.whySpecial || "Tranquil local spot away from commercial crowds."
      },
      cityEvents: mockEvents.filter(e => e.city.toLowerCase().includes(dest.city.toLowerCase()))
    }));

    return res.json({ success: true, count: enhancedGems.length, hiddenGems: enhancedGems });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch hidden gems.' });
  }
};

const getCultureStories = async (req, res) => {
  try {
    const { city = '' } = req.query;
    const cLower = (city || '').toLowerCase().trim();
    
    let stories = [];

    if (!cLower || cLower === 'all') {
      stories = [...mockCultureStories];
    } else {
      stories = mockCultureStories.filter(s =>
        s.destination && s.destination.toLowerCase().includes(cLower)
      );
    }

    // Dynamic Wikipedia fallback if city is not in hardcoded array!
    if (stories.length === 0 && cLower && cLower !== 'all') {
      try {
        const wikiRes = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`,
          { headers: { 'User-Agent': 'TravelGenieApp/1.0' }, timeout: 8000 }
        );
        if (wikiRes.data?.extract) {
          const capCity = city.charAt(0).toUpperCase() + city.slice(1);
          stories = [{
            destination: capCity,
            title: `Cultural Heritage & History of ${capCity}`,
            period: 'Historical Era to Present',
            story: wikiRes.data.extract,
            tradition: `Explore the vibrant local traditions, festivals, and culinary delights unique to ${capCity}.`,
            etiquette: `Respect local customs, dress appropriately when visiting religious sites, and greet locals warmly.`,
            thumbnail: wikiRes.data.thumbnail?.source || null,
            wikiUrl: wikiRes.data.content_urls?.desktop?.page || null,
            source: 'Wikipedia & TravelGenie Culture Hub'
          }];
        }
      } catch (e) {
        console.warn('Wikipedia fallback error:', e.message);
      }
    }

    if (stories.length === 0 && cLower) {
      const capCity = city.charAt(0).toUpperCase() + city.slice(1);
      stories = [{
        destination: capCity,
        title: `Discover the Culture & Heritage of ${capCity}`,
        period: 'Historical Era to Present',
        story: `${capCity} is a vibrant destination steeped in rich cultural heritage, ancient architecture, and unique local traditions.`,
        tradition: `Local festivals, traditional handicrafts, and regional culinary delicacies define life in ${capCity}.`,
        etiquette: `Respect local customs and greet residents warmly when visiting ${capCity}.`,
        source: 'TravelGenie Culture Hub'
      }];
    }

    return res.json({
      success: true,
      city: city || 'All Cities',
      count: stories.length,
      stories
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch cultural stories.' });
  }
};

const searchCultureStory = async (req, res) => {
  try {
    const { place } = req.query;
    if (!place) return res.status(400).json({ success: false, message: 'Place name is required.' });

    const mockMatch = mockCultureStories.filter(s =>
      s.destination.toLowerCase().includes(place.toLowerCase()) ||
      place.toLowerCase().includes(s.destination.toLowerCase())
    );

    let wikiData = null;
    try {
      const wikiRes = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place)}`,
        { headers: { 'User-Agent': 'TravelGenieApp/1.0' }, timeout: 8000 }
      );
      if (wikiRes.data?.extract) {
        wikiData = {
          title: wikiRes.data.title,
          extract: wikiRes.data.extract,
          thumbnail: wikiRes.data.thumbnail?.source || null,
          wikiUrl: wikiRes.data.content_urls?.desktop?.page || null,
        };
      }
    } catch (e) {
      console.warn('Wikipedia fetch failed:', e.message);
    }

    const stories = [...mockMatch];

    if (wikiData) {
      const alreadyCovered = mockMatch.some(s =>
        wikiData.title.toLowerCase().includes(s.destination.toLowerCase())
      );
      if (!alreadyCovered || mockMatch.length === 0) {
        stories.unshift({
          destination: wikiData.title,
          title: `The Story of ${wikiData.title}`,
          period: 'Historical Overview',
          story: wikiData.extract,
          tradition: `Explore local traditions, festivals, and cultural practices unique to ${wikiData.title}.`,
          etiquette: `Respect local customs and dress appropriately when visiting ${wikiData.title}.`,
          thumbnail: wikiData.thumbnail,
          wikiUrl: wikiData.wikiUrl,
          source: 'Wikipedia',
        });
      }
    }

    if (stories.length === 0) {
      stories.push({
        destination: place,
        title: `Discover ${place}`,
        period: 'Cultural Heritage',
        story: `${place} is a destination rich in history, culture, and local traditions.`,
        tradition: `Local festivals and traditional cuisine define the cultural fabric of ${place}.`,
        etiquette: `Respect local customs when visiting ${place}.`,
        source: 'TravelGenie',
      });
    }

    return res.json({
      success: true,
      place,
      count: stories.length,
      stories,
      wikiData,
    });
  } catch (error) {
    console.error('searchCultureStory error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to search cultural stories.' });
  }
};

module.exports = {
  getDestinations,
  getHiddenGems,
  getCultureStories,
  searchCultureStory
};
