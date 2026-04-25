<div align="center">

# 🎮 ARENAX
## India's Gaming Career & Community Platform

**The LinkedIn of Indian Esports**

[![Stack](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)]()
[![DB](https://img.shields.io/badge/Database-MongoDB-brightgreen)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%2018-blue)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()
[![Made for](https://img.shields.io/badge/Made%20for-India%20🇮🇳-orange)]()

*Connect gamers · Build careers · Empower India's gaming ecosystem*

</div>

---

## 📋 Table of Contents

1. [What is ArenaX?](#what-is-arenax)
2. [Core Features](#core-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Quick Start](#quick-start)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [Database Models](#database-models)
9. [Authentication Flow](#authentication-flow)
10. [Deployment Guide](#deployment-guide)
11. [Roadmap](#roadmap)
12. [Contributing](#contributing)

---

## What is ArenaX?

ArenaX is a full-stack web platform built specifically for **India's gaming community**. Think of it as LinkedIn meets Indeed — but for:

- 🎮 **Pro gamers** (BGMI IGLs, Valorant Duelists, Free Fire squads)
- 🎬 **Content creators** (YouTubers, streamers, editors, GFX artists)
- 🏢 **Esports organizations** (S8UL, GodLike, Global Esports, gaming cafes, content studios)
- 📣 **Support roles** (casters, coaches, analysts, bootcamp managers)

India has **500M+ gamers** and a rapidly growing esports industry. Yet there's no professional platform connecting talent with opportunities. ArenaX fills that gap.

---

## Core Features

### For Gamers & Creators (User Account)
| Feature | Description |
|---|---|
| 🏅 Gaming Profile | Showcase rank tiers (Conqueror, Radiant, etc.), stats, in-game roles |
| 🎬 Portfolio | Upload highlight clips, thumbnails, articles, and showcase links |
| 🏆 Achievements | Document tournament placements, milestones, and verifiable wins |
| 📊 Profile Score | Smart 0-100 completion tracker drives visibility in search |
| 💼 Job Applications | Browse and apply to org vacancies with a full application form |
| 📣 Community Feed | Share achievements, clips, thoughts — like Twitter for gamers |
| 🔍 Discoverability | Be found by orgs via role, game, state, tier, and "open to work" |
| 🔗 Social Links | Connect YouTube, Twitch, Instagram, Discord to your profile |

### For Organizations (Org Account)
| Feature | Description |
|---|---|
| 🏢 Org Profile | Showcase org achievements, rosters, sponsors, active games |
| 📋 Job Posting | Post vacancies with India-specific fields (device req, tier, language) |
| 👥 Application Pipeline | Review applicants, shortlist, schedule trials, update status |
| ✅ Verified Badge | Platform-verified orgs get a badge boosting trust |
| 📊 Dashboard | Active jobs, pending applications, profile analytics |
| 🎯 Targeted Hiring | Filter by game, state, availability, work type |

### Platform-Wide
- 🇮🇳 India-first: All 36 Indian states, INR salary, Hindi/English language fields
- 📱 Mobile-responsive design (India is 85% mobile gaming)
- 🎮 8+ supported games: BGMI, Valorant, Free Fire MAX, CODM, Pokémon UNITE, Chess, eFootball, Minecraft
- 🖥️ All device types: Mobile (Android/iOS), PC, Console, Emulator, Cloud Gaming
- 🔐 Dual authentication: Separate user and org login with JWT refresh tokens

---

## Tech Stack

```
┌─────────────────────────────────────────────────┐
│  FRONTEND                                        │
│  React 18 · React Router v6 · React Query        │
│  Axios (with auto-refresh interceptor)            │
│  react-hot-toast · framer-motion                 │
│  Custom CSS Design System (no UI lib dependency) │
└─────────────────────────────────────────────────┘
            ↕ REST API (JSON)
┌─────────────────────────────────────────────────┐
│  BACKEND                                         │
│  Node.js 20 LTS · Express.js 4                   │
│  Mongoose ODM · express-validator                │
│  bcryptjs (12 rounds) · jsonwebtoken             │
│  Helmet · express-rate-limit · morgan            │
│  Multer · Cloudinary (media uploads)             │
│  Nodemailer (email)                              │
└─────────────────────────────────────────────────┘
            ↕ Mongoose
┌─────────────────────────────────────────────────┐
│  DATABASE                                        │
│  MongoDB 7 (local dev · Atlas in production)     │
│  Collections: users, organizations, jobs,        │
│               posts, applications                │
└─────────────────────────────────────────────────┘
```

---

## Project Structure

```
arenax/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── constants.js        # Games, roles, tiers, device enums
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT protect, requireUser, requireOrg
│   │   ├── models/
│   │   │   ├── User.js             # User schema (gamers, creators, editors)
│   │   │   ├── Organization.js     # Org schema (esports orgs, studios)
│   │   │   ├── Job.js              # Job posting schema (India-specific fields)
│   │   │   ├── Post.js             # Community feed post schema
│   │   │   └── Application.js      # Job application + status pipeline
│   │   ├── routes/
│   │   │   ├── auth.js             # Register, login, refresh, logout
│   │   │   ├── users.js            # Profile CRUD, game profiles
│   │   │   ├── organizations.js    # Org profile, roster management
│   │   │   ├── jobs.js             # Job board CRUD + rich filters
│   │   │   ├── applications.js     # Apply, track, update status pipeline
│   │   │   ├── posts.js            # Feed, likes, comments
│   │   │   ├── games.js            # Games metadata API
│   │   │   ├── search.js           # Full-text search across entities
│   │   │   ├── upload.js           # Cloudinary image/video upload
│   │   │   └── dashboard.js        # Aggregated dashboard data
│   │   ├── utils/
│   │   │   └── seeder.js           # DB seeder with realistic demo data
│   │   └── index.js                # Express app entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js      # Global auth state (user/org)
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── Navbar.js       # Top nav with search + dropdown
│   │   │       └── LoadingScreen.js
│   │   ├── pages/
│   │   │   ├── Landing.js          # Public marketing / hero page
│   │   │   ├── Feed.js             # Community feed with compose
│   │   │   ├── Jobs.js             # Job board with filters
│   │   │   ├── JobDetail.js        # Job detail + apply CTA
│   │   │   ├── Apply.js            # Multi-field application form
│   │   │   ├── Discover.js         # Discover gamers & orgs
│   │   │   ├── Profile.js          # Public gamer profile
│   │   │   ├── OrgProfile.js       # Public org profile
│   │   │   ├── EditProfile.js      # Multi-tab profile editor
│   │   │   ├── Dashboard.js        # User dashboard
│   │   │   ├── OrgDashboard.js     # Org dashboard
│   │   │   ├── PostJob.js          # Full job posting form
│   │   │   ├── NotFound.js         # 404 page
│   │   │   └── auth/
│   │   │       ├── Login.js        # Dual-mode login (user/org toggle)
│   │   │       ├── RegisterUser.js # 3-step user registration
│   │   │       └── RegisterOrg.js  # Org registration
│   │   ├── styles/
│   │   │   └── globals.css         # Full CSS design system
│   │   ├── utils/
│   │   │   └── api.js              # Axios client + all API methods
│   │   ├── App.js                  # Router + route guards
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
│
├── docs/
│   └── TECHNICAL_REPORT.md         # Deep technical + knowledge report
├── docker-compose.yml
├── package.json                    # Root scripts (dev, install:all)
├── .gitignore
└── README.md                       # This file
```

---

## Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- MongoDB 6+ (local) OR MongoDB Atlas account (free M0)
- npm or yarn
- Git

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/arenax.git
cd arenax

# Install all dependencies at once
npm run install:all

# OR manually:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arenax
JWT_SECRET=your_super_secret_minimum_32_characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=another_secret_min_32_characters
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLIENT_URL=http://localhost:3000
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Seed the Database (Optional but Recommended)

```bash
cd backend
npm run seed
```

This creates:
- 4 sample organizations (S8UL Demo, GodLike Demo, Global Esports Demo, 8Bit Media Demo)
- 5 sample users (IGL, Creator, GFX Artist, Caster, Video Editor)
- 4 sample job posts (IGL, GFX Artist, Valorant Duelist, Video Editor)
- 4 community posts

**Demo credentials after seeding:**

| Type | Email | Password |
|---|---|---|
| 🎮 User (IGL) | jonathan.india@demo.gg | Demo@1234 |
| 🎮 User (Creator) | mortal.creator@demo.gg | Demo@1234 |
| 🎮 User (GFX Artist) | raveena.gfx@demo.in | Demo@1234 |
| 🏢 Org | recruit@s8ul-demo.gg | Demo@1234 |
| 🏢 Org | hr@godlike-demo.gg | Demo@1234 |

### 4. Run Development Servers

```bash
# From root — runs both backend + frontend concurrently
npm run dev

# OR separately:
npm run backend    # http://localhost:5000
npm run frontend   # http://localhost:3000
```

### 5. Using Docker (Full Stack)

```bash
docker-compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

---

## API Reference

### Authentication
```
POST /api/auth/register/user    Create gamer account
POST /api/auth/register/org     Create organization account
POST /api/auth/login            Login (user or org, set accountType field)
POST /api/auth/refresh          Refresh access token
POST /api/auth/logout           Logout (invalidate refresh token)
GET  /api/auth/me               Get current account
```

### Users
```
GET  /api/users                 List users (filters: game, role, state, openToWork)
GET  /api/users/:username       Get public profile
PUT  /api/users/profile         Update profile (auth)
PUT  /api/users/game-profile    Add/update game profile (auth)
POST /api/users/achievement     Add achievement (auth)
POST /api/users/portfolio       Add portfolio item (auth)
```

### Jobs
```
GET    /api/jobs                List jobs (filters: game, state, workType, locationType, search)
GET    /api/jobs/:id            Get job detail
POST   /api/jobs                Create job post (org auth)
PUT    /api/jobs/:id            Update job (org auth)
DELETE /api/jobs/:id            Close job (org auth)
```

### Applications
```
POST /api/apply/:jobId          Apply to job (user auth)
GET  /api/apply/my              My applications (user auth)
GET  /api/apply/job/:jobId      Job applications (org auth)
PUT  /api/apply/:appId/status   Update application status (org auth)
```

### Community Feed
```
GET  /api/posts                 Get posts (filters: game, type, featured)
POST /api/posts                 Create post (auth)
PUT  /api/posts/:id/like        Like/unlike (auth)
POST /api/posts/:id/comment     Comment (auth)
```

### Metadata
```
GET /api/games                  All games with tiers + roles
GET /api/games/roles            All professional role categories
GET /api/games/devices          All supported device types
GET /api/games/states           Indian states list
GET /api/games/job-fields       Job field enums (workType, salaryType, etc.)
GET /api/search?q=...&type=...  Search users/orgs/jobs
```

### Utilities
```
POST /api/upload/image          Upload image to Cloudinary (auth)
POST /api/upload/video          Upload video to Cloudinary (auth)
GET  /api/dashboard             Dashboard data (auth)
GET  /api/health                Health check
```

---

## Database Models

### Key Schema Highlights

**User** — stores gaming identity with embedded game profiles, achievements, portfolio. Profile score (0–100) calculated automatically on save via pre-save Mongoose hook.

**Organization** — stores org identity, roster (with refs to users), achievements, sponsors. Separate from User model with its own auth flow.

**Job** — India-specific fields: `deviceRequirements.requiredDevice`, `language`, `locationType` (Bootcamp vs WFH), `salary.currency: 'INR'`, `requirements.synergyExp`, `applicationProcess.trialMatch`.

**Application** — full status pipeline: `submitted → under_review → shortlisted → trial_scheduled → offer_extended → accepted / rejected`. Each status change is appended to `statusHistory[]` for audit trail.

**Post** — polymorphic `author` field supporting both User and Organization authors. Embedded comments (no separate collection for Phase 1 performance).

---

## Authentication Flow

```
REGISTRATION:
User fills form → POST /register/user → bcrypt hash password →
Create User doc → Generate JWT (access 7d) + Refresh (30d) →
Store refresh in DB → Return tokens to client

LOGIN:
POST /login with accountType field →
Load User OR Organization based on accountType →
bcrypt.compare password → Generate new tokens →
Clean expired refresh tokens (keep max 5) → Return tokens

CLIENT STORAGE:
localStorage: ax_token (access), ax_refresh (refresh), ax_type (accountType)

AUTO REFRESH (Axios Interceptor):
Any 401 response → POST /refresh with stored refresh token →
Rotate refresh token → Retry original request with new access token →
On failure → clear localStorage → redirect /login

PROTECTED ROUTES:
protect() middleware → verify JWT → load User OR Org →
attach to req.user / req.org / req.accountType →
requireUser() / requireOrg() enforce role separation
```

---

## Deployment Guide

### Frontend (Vercel — Free)
```bash
# Install Vercel CLI
npm i -g vercel

cd frontend
vercel

# Set env var in Vercel dashboard:
# REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (Railway or Render — Free tier)
```bash
# Railway
npm i -g @railway/cli
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

### Database (MongoDB Atlas — Free M0)
1. Create account at mongodb.com/atlas
2. Create M0 cluster (512MB free)
3. Whitelist your backend IP
4. Copy connection string to `MONGODB_URI`

### Media (Cloudinary — Free)
1. Create account at cloudinary.com
2. Copy Cloud Name, API Key, API Secret to env vars

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong, random JWT secrets (32+ chars)
- [ ] Enable MongoDB Atlas IP allowlist (restrict to backend IP)
- [ ] Set CORS `CLIENT_URL` to your production frontend URL
- [ ] Enable Cloudinary unsigned upload preset restrictions
- [ ] Set up MongoDB Atlas automated backups
- [ ] Configure custom domain + SSL (Cloudflare free tier)

---

## Roadmap

### ✅ Phase 1 — MVP (Current)
- [x] Dual auth (User + Organization)
- [x] Gaming profile with tiers, game profiles, achievements
- [x] Job board with India-specific fields
- [x] Application pipeline (submit → review → shortlist → offer)
- [x] Community feed with likes + comments
- [x] Discover page (search gamers + orgs)
- [x] Profile completion score (0–100)
- [x] Full responsive design

### 🔄 Phase 2 — Growth (Next 3–6 months)
- [ ] React Native mobile app (Expo)
- [ ] Email OTP verification (Nodemailer)
- [ ] In-app messaging (Socket.io)
- [ ] Push notifications
- [ ] Follow/follower system + feed personalization
- [ ] Advanced search (Atlas Search)
- [ ] Scrim scheduler / calendar
- [ ] Admin moderation dashboard

### 🚀 Phase 3 — Scale (6–18 months)
- [ ] Premium org plans (featured jobs, analytics)
- [ ] Sponsorship marketplace
- [ ] Tournament integration APIs
- [ ] Global expansion (SEA, MENA)
- [ ] Team formation / matchmaking tool
- [ ] API for third-party integrations

---

## Design System

ArenaX uses a custom CSS design system (no external UI library dependency):

- **Theme:** Dark Cyber-Saffron — dark backgrounds with saffron orange accents
- **Colors:** `--saffron: #FF6B00` · `--electric: #00E5FF` · `--bg-void: #0A0A0F`
- **Fonts:** Rajdhani (display) + Space Mono (stats/mono) + Noto Sans (body)
- **Philosophy:** India's identity (saffron) + gaming culture (dark, electric) = ArenaX

---

## Contributing

This is a solo-developer starter project. To contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit with clear messages
4. Open a PR with description of changes

Areas that need help:
- Unit tests (Jest + Supertest)
- React Native mobile app
- Accessibility improvements
- Performance optimizations

---

## License

MIT License — free to use, modify, and distribute.

---

<div align="center">

**Built with ❤️ for India's Gaming Community 🇮🇳🎮**

*ArenaX v1.0.0 — April 2025*

</div>
