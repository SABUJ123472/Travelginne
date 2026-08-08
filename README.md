# 🧞‍♂️ TravelGenie — Smart AI Travel Companion & Route Explorer

<p align="center">
  <img src="Frontend/public/expedition_journal.png" alt="TravelGenie Cover Artwork" width="100%" style="border-radius: 16px;" />
</p>

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18.3-blue.svg?style=for-the-badge&logo=react" alt="React 18" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-18+-green.svg?style=for-the-badge&logo=node.js" alt="Node.js" /></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-4.21-lightgrey.svg?style=for-the-badge&logo=express" alt="Express" /></a>
  <a href="https://mongodb.com"><img src="https://img.shields.io/badge/MongoDB-Atlas-green.svg?style=for-the-badge&logo=mongodb" alt="MongoDB" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
  <a href="https://openai.com"><img src="https://img.shields.io/badge/OpenAI-GPT_API-orange.svg?style=for-the-badge&logo=openai" alt="OpenAI" /></a>
</p>

> **Travel Smarter. Explore Deeper. TravelGenie.**  
> TravelGenie is an AI-powered smart tourism platform engineered for personalized itinerary generation, spatial route mapping, offbeat hidden gem discovery, budget optimization, real-time weather safety advisories, multilingual translation, transit navigation, and gamified location rewards. Designed with a Google Stitch-inspired **Editorial Vintage** design system.

---

## ✨ Key Features & Capabilities

### 🤖 1. AI Trip Planner
- Custom multi-day itinerary generation tailored to destination, dates, group size, budget category (`Shoestring`, `Standard`, `Opulent`), and travel styles (`Heritage`, `Food`, `Hidden Gems`, `Nature`).
- Generates structured day-by-day timelines, specific tourist spot names, activity descriptions, and estimated costs.
- 1-click **"Save Expedition to Account"** button synced with MongoDB database.

### 🗺️ 2. Spatial Travel Route Map (`JourneyMap`)
- Powered by Leaflet, OpenStreetMap, LocationIQ Maps & Geocoding API, and CartoDB tile layers.
- Numbered pin markers (`1`, `2`, `3`...) plotted in exact chronological order for every planned travel spot.
- Animated polyline connection routes (`Stop 1 ➔ Stop 2 ➔ Stop 3`).
- Multi-layer tile switcher (`Streets`, `Dark Mode`, `Satellite Imagery`).
- Persistent map lifecycle ensuring zero map flickering or re-render glitches.

### 🚌 3. Public Transport Navigator
- Multi-modal route comparator calculating travel times, fares (`₹`), transfer counts, and step-by-step directions for **Metro**, **Public Bus**, **Tram**, **Ferry**, and **Taxi / Rideshare**.
- Automatically highlights **⚡ Fastest Route** and **💰 Best Value Route** options.

### 🌤️ 4. Meteorological & Safety Engine
- Real-time weather telemetry fetching temperature (`°C`), feels-like estimates, weather conditions, humidity (`%`), wind speeds (`km/h`), rain risk (`%`), and barometric pressure (`hPa`).
- Provides travel safety advisory statuses (`Safe`, `Moderate Caution`) and traveler guidelines.

### 📖 5. Culture Stories & Heritage Archives
- Historical lore, traditional craft legacies, local food rituals (`Adda`, `Tea Tasting`, `Susegad`), and traveler etiquette guides for cities worldwide.
- Dynamic Wikipedia REST API fallback for any world destination.

### 💎 6. Offbeat Hidden Gems Discovery
- Curated showcase of underrated heritage sites away from commercial tourist crowds, complete with crowd levels, local legends, and GPS route navigation.

### 💰 7. Ledger Budget Planner
- Auto-splits travel budget across Accommodation (35%), Food (25%), Transport (15%), Activities (15%), Shopping (6%), and Emergency (4%).

### 🏆 8. Explorer Rewards & Leaderboard
- Daily check-in streak rewards (+50 PTS) and global explorer rankings.

### 🗣️ 9. Real-Time Multilingual Translator
- Instant translation between 8 languages (Bengali, Hindi, English, French, Spanish, Japanese, German, Italian) with essential phrasebooks.

---

## 🎨 Google Stitch Editorial Vintage Design System

TravelGenie features a modern, high-end editorial UI:
- **Canvas Body**: Warm off-white parchment `#faf8f5`.
- **Card Containers**: Crisp white `#ffffff` cards with subtle borders `#e2dad0`.
- **Primary Buttons & Active Links**: Warm Crimson Terracotta `#c85a44`.
- **Action Buttons**: Dark Navy `#19232d`.
- **Archival Lore Quote Boxes**: Sage green `#c3dec9` with deep forest text `#1e3b23`.
- **Typography**: **Playfair Display** (heritage headers), **Instrument Serif** (Bengali greetings), and **Plus Jakarta Sans** (body text).

---

## 🛠️ Tech Stack Quick Summary

Detailed technical specification available in [TECH_STACK.md](TECH_STACK.md).

- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Lucide React, Leaflet & React-Leaflet, Axios.
- **Backend**: Node.js, Express.js 4, MongoDB Atlas, Mongoose 8, JWT, Helmet, Express-Rate-Limit.
- **AI Integrations**: OpenAI GPT API, Google Gemini API.
- **External Telemetry**: LocationIQ Maps & Geocoding API, OpenWeatherMap, Open-Meteo, Wikipedia REST API.

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/TravelGenie.git
cd TravelGenie
```

### 2. Configure Backend Environment (`Backend/.env`)
Create a file named `.env` inside the `Backend/` folder:
```env
PORT=5000
JWT_SECRET=travelgenie_super_secret_jwt_key_2026

# OpenAI API Key (For AI Trip Planner & Itineraries)
OPENAI_API_KEY=your_openai_api_key_here

# LocationIQ API Key (For Maps & Geocoding)
LOCATIONIQ_API_KEY=pk.4a5adeda02b90e1f15befb4f35e86d9d

# OpenWeatherMap API Key (For Weather Telemetry)
WEATHER_API_KEY=354ba79da533837bf2830af35ae1e2c8

# MongoDB Connection String (Optional — falls back to demo memory store)
MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net/travelgenie
```

### 3. Run Servers

- **Backend Server**:
  ```bash
  cd Backend
  npm install
  npm start
  ```
  *Backend runs on `http://localhost:5000`*

- **Frontend Dev Server**:
  In a new terminal tab:
  ```bash
  cd Frontend
  npm install
  npm run dev
  ```
  *Frontend runs on `http://localhost:3001`*

---

## 🌐 Deployment Instructions

### Deploy to Render.com
1. Push this repository to GitHub.
2. Log in to [Render.com](https://render.com) and create a **New Blueprint**.
3. Render will auto-detect `render.yaml`.
4. Supply your `OPENAI_API_KEY`, `LOCATIONIQ_API_KEY`, and `WEATHER_API_KEY` under Environment Variables.
5. Click **Deploy**!

### Deploy to Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Vercel automatically detects `vercel.json` for API rewrites and Vite frontend builds.
3. Click **Deploy**!

---

## 📄 License
This project is licensed under the **ISC License**. Created for Hackathon 2026.
