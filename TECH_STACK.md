# 🛠️ TravelGenie — Technical Stack & Architecture Specification

> **A Comprehensive Engineering & Technology Manifest**  
> TravelGenie is an AI-powered smart tourism platform engineered with modern web technologies, spatial mapping APIs, generative artificial intelligence, and a Google Stitch-inspired editorial design system.

---

## 📐 High-Level Architecture Overview

```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                            REACT 18 FRONTEND                            │
 │  • Vite 5 • Tailwind CSS • Playfair Display / Instrument Serif Fonts   │
 │  • Lucide React Icons • Leaflet & LocationIQ Spatial Route Maps         │
 └────────────────────────────────────┬────────────────────────────────────┘
                                      │ REST API (JSON)
 ┌────────────────────────────────────▼────────────────────────────────────┐
 │                           NODE.JS / EXPRESS BACKEND                     │
 │  • JWT & Auth Middleware • Mongoose ORM • Express Rate Limit & Security │
 └──────┬─────────────────────────────┬─────────────────────────────┬──────┘
        │                             │                             │
 ┌──────▼──────┐               ┌──────▼──────┐               ┌──────▼──────┐
 │ GENERATIVE  │               │ GEOCODING & │               │ WEATHER &   │
 │   AI ENGINE │               │ MAP ROUTING │               │ CULTURAL    │
 │ • OpenAI    │               │ • LocationIQ│               │ • OpenWeather│
 │ • Gemini    │               │ • Nominatim │               │ • Wikipedia │
 └─────────────┘               └─────────────┘               └─────────────┘
```

---

## 🎨 Frontend Stack (Client-Side)

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | **React 18.3.1** | Declarative component-based architecture with hooks. |
| **Build Tooling** | **Vite 5.4.11** | Lightning-fast ESM bundler with Hot Module Replacement (HMR). |
| **Styling & Tokens** | **Tailwind CSS 3.4.16** | Utility-first CSS framework with custom color tokens (`parchment`, `terracotta`, `expnavy`, `archivalgreen`). |
| **Typography** | **Google Fonts** | • **Playfair Display**: Heritage headings<br>• **Instrument Serif**: Bengali greetings<br>• **Plus Jakarta Sans**: High-contrast body text<br>• **Cinzel**: Archival quotes |
| **Icon System** | **Lucide React 0.468** | Modern, lightweight SVG vector icon set. |
| **Client Routing** | **React Router DOM 6.28** | Dynamic client-side SPA routing with query param state. |
| **HTTP Client** | **Axios 1.7.9** | Promise-based HTTP requests with JWT request interceptors. |
| **Spatial Maps** | **Leaflet 1.9.4 & React-Leaflet 4.2.1** | Interactive canvas mapping with custom SVG markers, polyline routing, and multi-layer tile switching. |

---

## ⚙️ Backend Stack (Server-Side)

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | **Node.js (v18+)** | Asynchronous event-driven JavaScript runtime environment. |
| **Server Framework** | **Express.js 4.21** | Minimalist web framework managing REST API endpoints, routing, and controller middleware. |
| **Database & ORM** | **MongoDB & Mongoose 8.8.4** | Schemaless Document Database with Mongoose ORM schemas for `User`, `Trip`, `Destination`, and `Event`. Includes an in-memory fallback for offline/demo modes. |
| **Authentication** | **JSON Web Token (JWT) & Bcryptjs** | Stateless Bearer token authentication and salted password hashing. |
| **Security Headers** | **Helmet 8.0.0** | Express middleware setting HTTP security headers. |
| **Rate Limiting** | **Express Rate Limit 7.4.1** | Protects API endpoints against brute-force and DDoS attacks. |

---

## 🤖 AI & External Telemetry Integrations

### 1. Generative Artificial Intelligence
- **OpenAI GPT API (`openai 4.77.0`)**: Primary AI engine generating multi-day structured travel itineraries, activity estimates, cost distributions, and local cultural summaries.
- **Google Gemini AI (`@google/genai 0.1.1`)**: Secondary AI assistant powering the real-time TravelGenie conversational trip advisor.

### 2. Spatial Mapping & Geocoding APIs
- **LocationIQ Maps API**: Real-time forward geocoding, reverse geocoding, driving directions routing, and street tile layers.
- **OpenStreetMap Nominatim**: Fallback open-source geocoding service.
- **CartoDB & ArcGIS Imagery**: Multi-layer tile options (`streets`, `dark`, `satellite`).

### 3. Weather & Safety Telemetry
- **OpenWeatherMap REST API**: Live meteorological telemetry (temperature, feels-like, wind speed, humidity, rain probability, pressure).
- **Open-Meteo Satellite API**: Zero-key fallback weather API providing global satellite forecasts.

### 4. Knowledge & Culture Hub
- **Wikipedia REST API**: Real-time historical summary extractions for global cities.

---

## 🎭 Design System Architecture (Google Stitch Editorial Theme)

```
🎨 Color Palette Tokens:
├── Parchment Canvas   : #faf8f5 (Off-white / Warm parchment)
├── Parchment Cards    : #ffffff (Crisp white with #e2dad0 borders)
├── Input Controls     : #f2eee5 (Light parchment with #1c1917 charcoal text)
├── Terracotta Brand   : #c85a44 (Primary accent buttons, active pills, badges)
├── Dark Navy Action   : #19232d (Primary submit actions & navbar badges)
└── Archival Lore      : #c3dec9 (Sage green background with #1e3b23 text)
```

---

## 🚀 Deployment & DevOps Configuration

- **Monorepo Scripts**: Root `package.json` with `concurrently 9.1.0` for running frontend and backend simultaneously.
- **Render.com**: Automated full-stack hosting configured via `render.yaml`.
- **Vercel**: Serverless frontend & API rewrites configured via `vercel.json`.

---

*TravelGenie Technical Stack Documentation • 2026 Edition*
