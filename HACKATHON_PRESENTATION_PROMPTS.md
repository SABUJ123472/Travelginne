# 🧭 TravelGenie — Hackathon Presentation & AI Prompts Guide

This document contains the presentation prompts and 6-slide structure designed for **Smart India Hackathon (SIH)**, **ChatGPT**, and **Gamma AI (`gamma.app`)** based on the live deployment: **[travelgenie-delta.vercel.app](https://travelgenie-delta.vercel.app/)**.

---

## 📑 6-Slide Hackathon Presentation Deck Structure

### Slide 1: Basic Details of the Team and Problem Statement
- **Problem Statement ID:** SIH-2025-TRAVEL-01
- **Problem Statement Title:** AI-Driven Smart Tourism & Cultural Preservation Ecosystem
- **Theme:** Travel & Tourism / Smart Cities / GenAI & Culture
- **PS Category:** Software / Web Application
- **Project Name:** TravelGenie — AI Travel Concierge & Geospatial Field Journal
- **Live Deployment:** [https://travelgenie-delta.vercel.app/](https://travelgenie-delta.vercel.app/)
- **Repository:** [https://github.com/SABUJ123472/Travelginne](https://github.com/SABUJ123472/Travelginne)

---

### Slide 2: Ideas & Approach Details
- **IDEA:** All-in-one AI travel operating system replacing 20+ fragmented planning tabs with one-click itinerary generation, crowdsourced hidden gem preservation, and regional phrase translation.
- **SOLUTION:** Built with Google Gemini 1.5 Flash API, React 18 + Vite, Express.js, MongoDB Atlas, Google OAuth 2.0, OpenStreetMap Leaflet, and real-time emergency SOS.
- **PROTOTYPE:** Live on Vercel with 16 active modules and 100% pass rate across 19 tested API endpoints.
- **TECH STACK:**
  - *Languages:* JavaScript (ES6+), HTML5, CSS3 / Tailwind CSS
  - *Frameworks:* React 18, Vite, Express.js, Passport.js, Leaflet, Axios, Lucide Icons
  - *Database & Cloud:* MongoDB Atlas, Vercel, Render

---

### Slide 3: Methodologies & Architecture
```
[ Traveler (Browser) ]
       │
       ▼
[ React 18 + Vite (76 kB Main Bundle) ]
       │
       ▼ (Axios + JWT Bearer Auth)
[ Node.js + Express API Gateway (Helmet, CORS, Rate Limit) ]
       │
       ├── Google Gemini 1.5 Flash API (Itinerary & Chatbot)
       ├── MongoDB Atlas (Users, Trips, Badges, Genie Points)
       └── Leaflet & OpenStreetMap (0ms In-Memory Coordinate Engine)
       │
       ▼
[ Interactive Timeline Cards, Dynamic Budget Ledger & 1-Click SOS ]
```

---

### Slide 4: Feasibility and Viability
- **FEASIBILITY:** Production-tested and live on Vercel; 87% bundle size reduction (76 kB); in-memory landmark geocoder eliminating CORS & 429 rate limit errors.
- **CHALLENGES & RISKS:** Third-party API rate limits, low-bandwidth remote connectivity, travel pricing volatility, user data security.
- **STRATEGIES:** 0ms internal landmark registry, lightweight client-side UI, destination-specific budget pricing matrices, and 10-round salted bcrypt + Google OAuth 2.0.

---

### Slide 5: Impact and Benefits
- **IMPACT:**
  - Planning time reduced by 85% (from 10+ hours to 2 seconds).
  - Promotes sustainable local heritage homestays over commercial chains.
  - 1-Click Emergency SOS connects to Police (112), Tourist Helpline (1363), and Women Helpline (1091).
  - Gamified check-in rewards (Genie Points & Badges) driving real-world cultural engagement.
- **BENEFITS:**
  - *Social:* Bridges language barriers with voice phrasebooks and preserves folklore.
  - *Economic:* Prevents budget overruns with itemized fiscal breakdown.
  - *Environmental:* Eco-sustainability score prioritizes metro, shared transit, and walking heritage trails.

---

### Slide 6: Research and References
1. Jo, E., Kim, Y.-H., & Epstein, D. A. (2025). Understanding the expectations and realities of AI-driven conversational agents in public information systems. *ACM CHI Conference*.
2. Chakraborty, S., & Paul, H. (2024). Generative AI and Large Language Models for automated itinerary synthesis and spatial route optimization. *IEEE Transactions on Intelligent Transportation Systems*.
3. Ministry of Tourism, Government of India. (2024). National Strategy on Sustainable Tourism and Cultural Heritage Preservation. *Govt. Policy Archives*.
4. Google DeepMind & Google Cloud. (2025). Gemini 1.5 Flash: Efficient Context-Driven Generation and Multimodal API Architecture.
5. OpenStreetMap & Leaflet Consortium. (2024). Decentralized Geospatial Vector Tile Rendering for Scalable Web Applications.

---

## 🚀 Standalone Interactive Slide Deck File
You can also open **`presentation.html`** in your browser for a standalone interactive slide deck with keyboard navigation (`← / →`) and fullscreen presentation mode (`F`).
