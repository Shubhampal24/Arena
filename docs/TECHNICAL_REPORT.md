# ArenaX — Deep Technical & Knowledge Flow Report
## India's Gaming Career & Community Platform | Solo Developer Edition

---

## 1. EXECUTIVE SUMMARY

ArenaX is a full-stack web platform built for India's gaming ecosystem — a LinkedIn + Indeed hybrid designed exclusively for the ₹11,000 Crore Indian gaming industry. It connects individual gaming professionals (players, IGLs, content creators, video editors, GFX artists, casters) with gaming organizations (esports orgs, content studios, gaming cafes, event companies) through professional profiles, a specialized job board, a community feed, and a full application pipeline.

**The Gap ArenaX Fills:**
No existing platform in India provides professional-grade hiring infrastructure for the gaming industry. LinkedIn lacks gaming-specific fields (rank tiers, game roles, highlight clips). Indeed lacks esports context. Discord servers are informal. ArenaX is built ground-up for this vertical.

**Target Market (India, Phase 1):**
- 500M+ gamers in India (IAMAI 2025)
- 85% mobile gaming penetration
- Growing esports economy: ₹11,000 Crore market, projected ₹33,000 Crore by 2028

---

## 2. DOMAIN RESEARCH — INDIAN ESPORTS ECOSYSTEM

### 2.1 Top Indian Esports Organizations (Platform Target Customers)

| Organization | Founded | Key Games | Notable Achievements |
|---|---|---|---|
| **S8UL** | 2020 | BGMI, Valorant, CODM, Chess, EA FC | 4x Esports Content Group of Year Award; EWC 2025 + 2026 participant; 25+ resident creators at Mumbai gaming house |
| **GodLike Esports** | 2019 | BGMI, Free Fire | Largest mobile esports fanbase in India; EWC 2026 Club Partner Program (USD 20M program) |
| **Global Esports** | 2017 | Valorant, BGMI | India's first T1 Valorant org; VCT Pacific circuit participant |
| **OR Esports** | 2020 | BGMI, Free Fire | Leading Maharashtra esports org |
| **Revenant Esports** | 2020 | BGMI | Strong Tier-2 BGMI presence |
| **Team XO** | 2020 | BGMI | Known for aggressive player development pipeline |
| **Enigma Gaming** | 2019 | BGMI, Chess | Diversified portfolio including Chess esports |
| **8Bit Creatives** | 2018 | Content | Creator management arm; parent company of S8UL |

### 2.2 Hiring Patterns Observed in Indian Esports

Based on analysis of public recruitment posts from S8UL, GodLike, Global Esports, and mid-tier Indian orgs:

**For Competitive Players:**
- Trial matches are standard (3-10 custom matches before offer)
- Discord ID is mandatory in every application
- Device requirements are non-negotiable (iPhone 13+ or "SD 8 Gen 1+" for mobile titles)
- Stats screenshot required at application stage (rank, K/D, win rate)
- Tournament experience valued even if small (state-level, school-level)
- Age: Most orgs want 17–26; bootcamp roles often require 18+ for travel consent

**For Content Roles:**
- Portfolio is king — YouTube subscriber count is secondary to quality
- Creative test (design one thumbnail, edit one raw clip) is common pre-hire
- WFH is accepted for most content roles (unlike competitive)
- Turnaround time expectations clearly stated (e.g., "24-hour thumbnail delivery")

**For Operational Roles:**
- Manager roles need Hindi fluency for India operations + English for org emails
- Bootcamp Manager specifically requires onsite presence at gaming house
- Analytics/Coaching roles increasingly need tools knowledge (Overwolf, custom stat sheets)

### 2.3 Game Tier Systems (Complete Reference for Database Enums)

**BGMI — Battlegrounds Mobile India (Krafton)**
- Path: Bronze I–V → Silver I–V → Gold I–V → Platinum I–V → Diamond I–V → Crown I–V → Ace → Ace Master → Ace Dominator → **Conqueror**
- Conqueror = Top 500 players on India server per season. Most prestigious mobile rank in India.
- Org minimum for competitive roles: Ace Dominator (Conqueror preferred)

**Valorant (Riot Games) — PC**
- Path: Iron 1–3 → Bronze 1–3 → Silver 1–3 → Gold 1–3 → Platinum 1–3 → Diamond 1–3 → Ascendant 1–3 → Immortal 1–3 → **Radiant**
- Org minimum for competitive roles: Immortal 1 (Radiant preferred for Tier-1 orgs)
- Key stat: ACS (Average Combat Score) and HS% more relevant than rank alone

**Free Fire MAX (Garena)**
- Path: Bronze → Silver → Gold I–III → Platinum I–III → Diamond I–III → Heroic → **Grandmaster**
- Org minimum: Diamond III (Heroic preferred)

**Call of Duty Mobile (Activision/TiMi Studio)**
- Path: Rookie I–III → Veteran I–III → Elite I–III → Pro I–III → Master I–III → Grandmaster I–III → **Legendary**
- Org minimum: Master III (Legendary preferred)

**Pokémon UNITE (TiMi/Nintendo)**
- Path: Beginner 1–10 → Great 1–5 → Expert 1–5 → Veteran 1–5 → Ultra 1–5 → **Master**
- Org minimum: Ultra (Master preferred)

### 2.4 Complete Professional Roles Taxonomy

```
COMPETITIVE (In-Game):
├── IGL (In-Game Leader) — Strategy caller, zone plays, rotation decisions
├── Entry Fragger — First to push; highest risk, highest impact
├── Assaulter — Mid/late game aggression specialist
├── Rusher — Close-range CQB specialist (mobile titles)
├── Sniper / AWPer — Long-range precision; map control through angles
├── Support Player — Utility (grenades, heals, smokes, revives)
├── Lurker — Silent flanker, independent positioning
├── Flex Player — Role-agnostic; adapts to comp needs
├── Scout — Early rotation intel, zone-edge plays
├── Jungler (MOBA) — Neutral objective control, ganking
├── Duelist (Valorant) — Entry fraggers with self-sufficient kits
├── Controller (Valorant) — Smokes, vision denial
├── Initiator (Valorant) — Setup teammates, gather info
├── Sentinel (Valorant) — Site anchor, post-plant
└── All-Rounder — Balanced across multiple roles

CONTENT & MEDIA:
├── Gaming Content Creator (YouTube, long-form)
├── YouTube Shorts Creator
├── Twitch / Loco Streamer
├── Instagram Gaming Creator
├── Podcast Host
├── Gaming Blogger / Writer
├── Script Writer
└── Lore Writer

MEDIA PRODUCTION:
├── Video Editor (YouTube long-form)
├── Montage Editor (highlight reels, recruitment clips)
├── GFX Artist / Thumbnail Designer (Photoshop, Illustrator)
├── Motion Graphics Designer (After Effects)
├── 3D Animator
├── 2D Animator
├── Highlight Editor
├── Sound Designer / Music Composer
└── Voice Over Artist

ESPORTS OPERATIONS:
├── Team Manager (day-to-day player management)
├── Bootcamp Manager (residential gaming house operations)
├── Esports Coach (tactical review, player development)
├── Analyst / Statistician (data, opponent study)
├── Caster / Commentator (live event commentary)
├── Observer (broadcast camera operator)
├── Host / MC (event host, stage personality)
├── Scrim Coordinator (scheduling practice matches)
├── Performance Psychologist
├── Nutritionist / Fitness Coach
├── Equipment Manager
├── IT / Network Admin (gaming house infrastructure)
└── Tournament Organizer

BUSINESS & SUPPORT:
├── Talent Manager (player/creator talent agency)
├── Social Media Manager
├── Brand Manager
├── PR Manager
├── Sponsorship Executive
├── Talent Scout
├── Gaming Cafe Owner / Manager
├── Esports Entrepreneur
├── Game Developer
├── Gaming UI/UX Designer
└── Chef (Gaming House) — yes, this is a real role at top gaming houses
```

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Technology Decisions (Solo Developer Rationale)

**Why Node.js + Express over Python/FastAPI?**
- Shared language with frontend (React) — single language mental model for solo dev
- Express ecosystem is mature and vast (auth, validation, uploads all have battle-tested packages)
- MongoDB + Mongoose = native JSON; no ORM friction
- Faster iteration speed for MVP

**Why MongoDB over PostgreSQL?**
- Gaming profiles are naturally document-shaped (embedded game profiles, achievements, portfolio items)
- Schema flexibility for Phase 1: easy to add new game fields without migrations
- Horizontal scaling story is cleaner for Phase 3
- MongoDB Atlas free M0 tier for zero-cost production start

**Why React (CRA) over Next.js?**
- CRA is simpler for a solo dev starting from scratch (no SSR complexity to manage)
- API is separately hosted; SEO can be handled with React Helmet for Phase 1
- Phase 2 migration to Next.js or Vite is straightforward
- Focus is on the product logic, not framework configuration

### 3.2 Full Request Lifecycle

```
Browser → React Page Component
        → calls usersAPI.getAll() [axios]
        → Axios interceptor attaches Bearer token
        → HTTP GET /api/users?game=bgmi&state=Maharashtra
        → Express router: /api/users
        → optionalAuth middleware (attach user context if token present)
        → Route handler: build query object from req.query
        → User.find(query).select('-password -phone').sort().limit()
        → Mongoose: generates MongoDB query
        → MongoDB Atlas: executes query, returns documents
        → Mongoose: deserializes to JS objects
        → Route handler: res.json({ success: true, total, data: users })
        → Axios response: data.data
        → React: setUsers(data.data) → re-render
        → UI: displays user cards
```

### 3.3 Authentication Architecture (Detailed)

**Token Strategy:**
- Access Token: JWT, 7-day expiry, signed with `JWT_SECRET`
- Refresh Token: JWT, 30-day expiry, stored as array in User/Org document in MongoDB
- Rotation: Each refresh invalidates the old refresh token and issues a new one
- Cleanup: On login, expired refresh tokens are pruned; max 5 active tokens per account
- Account Type in Payload: `{ id, accountType: 'user' | 'organization' }` — middleware uses this to load the correct model

**Refresh Flow (Axios Interceptor):**
```javascript
// On any 401 response (not already retrying):
1. Read ax_refresh + ax_type from localStorage
2. POST /api/auth/refresh → { refreshToken, accountType }
3. Server verifies refresh token, rotates it, returns new pair
4. Store new ax_token + ax_refresh in localStorage
5. Retry original request with new access token
6. On refresh failure → clear storage → redirect /login
```

**Security Hardening:**
- bcryptjs with 12 salt rounds (approx 300ms per hash — strong brute-force resistance)
- Helmet.js: 14 security HTTP headers automatically set
- express-rate-limit: 100 req/15min globally, 10 req/15min on auth routes
- express-validator: All input sanitized before DB operations
- Sensitive fields use `select: false` in schema (phone, password, pan, refreshTokens)
- `toPublicProfile()` method strips all sensitive data before API responses
- No raw MongoDB queries — all through Mongoose schema (injection protection)

### 3.4 Database Index Strategy

```javascript
// User collection — hot query paths
{ username: 1 }                                    // Profile URL lookup
{ email: 1 }                                       // Auth lookup
{ primaryRole: 1, state: 1 }                       // Discover page filter
{ openToWork: 1, primaryGame: 1 }                  // Org talent search
{ 'gameProfiles.gameId': 1, 'gameProfiles.currentTier': 1 }  // Tier filter

// Job collection
{ roleCategory: 1, isActive: 1 }                  // Category browse
{ gameId: 1, isActive: 1 }                         // Game filter
{ 'location.state': 1, isActive: 1 }               // State filter
{ isFeatured: -1, createdAt: -1 }                  // Featured jobs first
{ title: 'text', description: 'text', tags: 'text' }  // Full-text search

// Application collection
{ jobId: 1, userId: 1 }  unique                    // Duplicate application prevention
{ userId: 1, status: 1 }                           // My applications
{ orgId: 1, status: 1 }                            // Org's pending review queue
```

### 3.5 Profile Score Algorithm

Calculated automatically in Mongoose `pre('save')` middleware:

```
+10  displayName present
+10  avatar uploaded (not default)
+10  bio written (any length)
+10  primaryRole selected
+10  primaryGame selected
+15  at least 1 game profile with tier
+10  at least 1 achievement
+10  at least 1 portfolio item
+10  at least 1 social link connected
+5   state AND city both filled
─────────────────────────────
100  max score
```

Impact of score:
- Search ranking: `sort({ profileScore: -1 })` → higher score = shows first in Discover
- Visual progress bar in profile and dashboard → nudges completion behavior
- Org perspective: incomplete profiles (score < 40) are deprioritized in results

---

## 4. FRONTEND ARCHITECTURE

### 4.1 Route Structure & Guards

```
Public Routes (no auth required):
  /                 Landing page
  /jobs             Job board
  /jobs/:id         Job detail
  /discover         Discover gamers & orgs
  /u/:username      Gamer public profile
  /org/:slug        Org public profile

Guest-Only Routes (redirect if authenticated):
  /login            Dual login (user/org)
  /register         User registration (3 steps)
  /register/org     Org registration

User-Protected Routes:
  /feed             Community feed
  /dashboard        User dashboard
  /profile/edit     Edit profile
  /jobs/:id/apply   Apply to job

Org-Protected Routes:
  /org/dashboard    Org dashboard
  /post-job         Post a job vacancy
```

**Route Guard Implementation:**
```jsx
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const UserRoute = ({ children }) => {
  const { isUser } = useAuth();
  return isUser ? children : <Navigate to="/org/dashboard" />;
};
// (Org/Admin variants similar)
```

### 4.2 Design System — Color Rationale

| Token | Value | Usage | Rationale |
|---|---|---|---|
| `--saffron` | `#FF6B00` | Primary CTA, active states, highlights | India's national color; gaming energy; distinctive from competitors |
| `--electric` | `#00E5FF` | Org accent, tech elements | Technology, professionalism, distinct from saffron |
| `--purple-light` | `#A855F7` | Premium, achievements | "Rare" gaming items are purple (Legendary tier visual language) |
| `--india-green` | `#138808` | Success, "open to work" | India flag; positive signals |
| `--bg-void` | `#0A0A0F` | Page background | Darkest dark; cinematic game UI feel |
| `--bg-card` | `#13131F` | Cards, panels | Slight elevation from background |

**Typography Rationale:**
- **Rajdhani** (display): Military/technical feel; popular in Indian design; works perfectly for gaming UI headings
- **Space Mono** (stats/mono): Mono font for numbers (K/D, stats, rank) — feels like a game HUD
- **Noto Sans** (body): Pan-Indian language support; Google's universal font; clean at small sizes

### 4.3 API Client Pattern

```javascript
// Centralized axios instance with auto-refresh
const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

// Request interceptor: inject auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ax_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      // Attempt token refresh...
    }
  }
);

// Grouped API modules
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  create: (data) => api.post('/jobs', data),
  // ...
};
```

This pattern means every page component makes clean calls:
```javascript
const { data } = await jobsAPI.getAll({ game: 'bgmi', state: 'Maharashtra' });
```
No raw axios calls scattered across components.

---

## 5. JOB SCHEMA — INDIA-SPECIFIC FIELD DESIGN

This is the most domain-specific part of ArenaX. The Job schema was designed by analyzing real Indian esports org recruitment posts:

### 5.1 Device Requirements Object
```javascript
deviceRequirements: {
  requiredDevice:  "Must have iPhone 13+ or Android SD8 Gen1+",
  minRAM:          "8GB minimum, 12GB preferred",
  minProcessor:    "Snapdragon 8 Gen 1 / Apple A15+",
  internetSpeed:   "50 Mbps+ stable, fiber preferred",
  peripherals:     ["Mechanical keyboard", "Gaming mouse", "144hz monitor"],
  softwareTools:   ["Adobe Premiere Pro", "OBS Studio", "DaVinci Resolve"],
  customNote:      "Must have access to licensed Adobe CC suite"
}
```

Why this exists: In BGMI recruitment, an org needs to know if a player has an iPhone 13+ (gyroscope advantage in iOS) vs Android. For video editors, software licenses matter. No other job platform captures this.

### 5.2 Salary Types for Gaming
```
Monthly Stipend   — fixed monthly payment (most common for org contracts)
Revenue Share     — % of ad revenue / views (for content creator roles)
Prize Pool %      — % of tournament winnings (for competitive players)
Hourly Rate       — for freelance designers, editors
Project Based     — fixed amount per deliverable
Unpaid (Exposure) — for grassroots/new orgs (controversial but exists)
Negotiable        — TBD based on discussion
```

### 5.3 Application Process Pipeline
```
Status Flow:
submitted → under_review → shortlisted → trial_scheduled → offer_extended → accepted
                                     ↘ rejected
                         ↘ rejected
             ↘ withdrawn (applicant pulls out)

Each status change stored in statusHistory[] with timestamp + note:
[
  { status: 'submitted',      changedAt: ..., note: 'Application received' },
  { status: 'shortlisted',    changedAt: ..., note: 'K/D and tier verified' },
  { status: 'trial_scheduled',changedAt: ..., note: 'Discord scrim: Saturday 8PM' },
  { status: 'offer_extended', changedAt: ..., note: 'Monthly stipend: ₹20,000' },
]
```

This gives both applicants (in their dashboard) and orgs (in their pipeline view) full visibility into where a candidate stands.

---

## 6. SCALABILITY ANALYSIS

### 6.1 Phase 1 (MVP) — 0–10K Users
**Infrastructure:**
- Single VPS (DigitalOcean Droplet $12/mo or Railway free tier)
- MongoDB Atlas M0 (512MB, free) → M10 ($57/mo at scale)
- Cloudinary free tier (25GB, 25K transformations)
- Vercel (frontend, free)

**Code-level optimization already in place:**
- Pagination on all list endpoints (default limit: 20)
- `.select()` on all queries (never load password, refreshTokens, etc.)
- Lean indexes on hot query paths
- Rate limiting prevents abuse

### 6.2 Phase 2 Growth — 10K–100K Users
**Add:**
- Redis for refresh token storage + rate limiting (removes DB read on every request)
- PM2 cluster mode (uses all CPU cores for Node.js)
- MongoDB Atlas M30 + read replicas for analytics queries
- Cloudflare CDN in front of both frontend and backend
- Image optimization via Cloudinary's auto-quality + auto-format

**Code changes:**
- Move from localStorage to httpOnly cookies for tokens (XSS protection)
- Add Socket.io for real-time notifications and messaging
- Implement cursor-based pagination for infinite scroll (vs offset)

### 6.3 Phase 3 Scale — 100K–1M Users
**Architecture evolution:**
- Kubernetes (GKE) for container orchestration
- Separate microservices: auth-service, jobs-service, feed-service, notifications-service
- Kafka for event streaming (new job posted → fan-out notifications to matching users)
- Elasticsearch for full-text search (replace MongoDB text indexes)
- S3 + CloudFront for media at scale (replace Cloudinary)
- Multi-region: Mumbai ap-south-1 (primary) + Singapore ap-southeast-1 (latency for SEA expansion)

---

## 7. SEO & GROWTH STRATEGY

### 7.1 Programmatic SEO Pages
ArenaX should generate SEO pages for long-tail keywords:
- `/jobs/bgmi-igl-india` — "BGMI IGL Jobs India"
- `/jobs/video-editor-gaming-wfh` — "Gaming Video Editor Work From Home"
- `/discover/bgmi-conqueror-players-maharashtra` — "BGMI Conqueror Players Maharashtra"

These pages are auto-generated from filters and are indexed by Google, bringing organic traffic.

### 7.2 Google Jobs Integration
Job posts implementing JSON-LD `JobPosting` schema appear in Google's job search carousel:
```json
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "BGMI IGL Wanted",
  "description": "...",
  "datePosted": "2025-04-10",
  "validThrough": "2025-05-10",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "S8UL",
    "sameAs": "https://s8ul.gg"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "value": { "@type": "QuantitativeValue", "minValue": 15000, "maxValue": 40000, "unitText": "MONTH" }
  }
}
```

### 7.3 Community Growth Loop
```
Org posts job → Applicants discover platform → Applicants create profiles →
Profiles visible to other orgs → More orgs join → More jobs posted →
More gamers join → Network effect builds
```

---

## 8. MONETIZATION ROADMAP

### 8.1 Free Tier (Launch → 12 months)
- Users: Unlimited everything
- Orgs: 3 active job posts, basic dashboard
- Goal: Build userbase and org trust before monetizing

### 8.2 Org Pro — ₹2,999/month
- Unlimited job posts
- Featured job placement (top of search)
- Advanced candidate filters (filter by tier, stats, state)
- Application notes + rating system
- CSV export of applications
- Org analytics (profile views, job views, conversion rate)

### 8.3 Org Enterprise — ₹9,999/month
- Everything in Pro
- Verified org badge
- Custom org landing page (custom slug + branding)
- Priority support
- ATS webhook integration
- Tournament sponsorship listings (brand reach tool)

### 8.4 Creator Sponsorship Marketplace — Phase 3
- Brands create sponsorship briefs (budget, deliverables, game focus)
- Creators apply to brand deals through platform
- ArenaX takes 12–15% platform fee on successful deals
- Replaces fragmented DM-based brand deal process in India

---

## 9. TESTING STRATEGY

### 9.1 Critical Test Cases (Manual Pre-Launch)

**Auth Flow:**
```
✓ Register user with duplicate email → 409 error message
✓ Register user with duplicate username → 409 error message
✓ Login with wrong password → 401 error
✓ Access /feed without auth → redirect to /login
✓ Access /org/dashboard as user → redirect to /dashboard
✓ Token expiry → auto-refresh → seamless UX (no logout)
✓ Logout → token invalidated → can't use old refresh token
```

**User Flow:**
```
✓ Complete registration → profile score reflects filled fields
✓ Add game profile → profile score increases by 15
✓ Upload avatar → profile score increases by 10
✓ Set openToWork → badge appears on discover page
✓ Apply to job → duplicate application returns 409
✓ Application status updates visible in dashboard
```

**Org Flow:**
```
✓ Post job → appears in /jobs listing
✓ Post job → applicant count starts at 0
✓ View applications → only own job applications visible
✓ Update application status → statusHistory updated
✓ Close job → job removed from active listings
```

**Security:**
```
✓ Org cannot update another org's job
✓ User cannot access /api/apply/job/:id (org-only route)
✓ Org cannot apply to jobs (user-only route)
✓ XSS attempt in profile bio → sanitized by express-validator
✓ Rate limit: 11 login attempts within 15 minutes → 429 response
```

### 9.2 Automated Testing Stack (Phase 2)
```bash
# Backend unit tests
npm install --save-dev jest supertest mongodb-memory-server

# Test structure
backend/
  src/
    __tests__/
      auth.test.js         # Register/login/refresh flow
      jobs.test.js         # CRUD + filter tests
      applications.test.js # Apply + status pipeline
      auth.middleware.test.js # protect/requireUser/requireOrg
```

---

## 10. DEPLOYMENT ARCHITECTURE (PRODUCTION)

### 10.1 Zero-Cost Launch Stack

```
Domain:    GoDaddy/Namecheap .gg domain (~₹2,000/year)
DNS/CDN:   Cloudflare (free tier) — DDoS protection + cache
Frontend:  Vercel (free tier) — auto-deploy from GitHub
Backend:   Railway ($5/month) or Render (free tier with sleep)
Database:  MongoDB Atlas M0 (free — 512MB)
Media:     Cloudinary (free — 25GB)
Email:     Gmail SMTP (free — 500/day) → SendGrid (free — 100/day)
           Total: ~₹2,000–4,000/year
```

### 10.2 Environment-Specific Config

```javascript
// Production Guards
if (process.env.NODE_ENV === 'production') {
  // Strict CORS (no localhost)
  // Secure cookies (httpOnly, sameSite: 'strict')  
  // Disable morgan request logging (use Winston to files)
  // Enable compression middleware
  // Serve static files via CDN only
}
```

### 10.3 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  test-and-deploy:
    steps:
      - Run backend tests (Jest)
      - Deploy backend to Railway
      - Deploy frontend to Vercel
      - Run smoke tests (health endpoint check)
      - Notify Discord on success/failure
```

---

## APPENDIX A: Constants Reference

All game data, rank tiers, professional roles, device types, Indian states, org types, and job field enums are defined in a single source of truth:

```
backend/src/config/constants.js
```

This file exports:
- `GAMES[]` — 8 games with id, name, devices[], tiers[], roles[]
- `PROFESSIONAL_ROLES{}` — categorized role taxonomy (COMPETITIVE, CONTENT, PRODUCTION, OPERATIONS, BUSINESS)
- `DEVICES[]` — 13 device/platform types
- `ORG_TYPES[]` — 15 organization types
- `INDIAN_STATES[]` — all 36 states + UTs
- `JOB_FIELDS{}` — enums for WORK_TYPE, LOCATION_TYPE, LANGUAGE, SALARY_TYPE, EXPERIENCE_LEVEL

The frontend fetches these at startup via `/api/games/*` routes, ensuring form dropdowns always match the backend schema.

---

## APPENDIX B: File Count & Line Estimates

| Directory | Files | Estimated Lines |
|---|---|---|
| Backend src/ | 16 | ~2,400 |
| Frontend src/ | 20 | ~4,800 |
| Config + docs | 8 | ~900 |
| **Total** | **44** | **~8,100** |

This is a lean, focused MVP. No bloat, no over-engineering — exactly right for a single developer launching Phase 1.

---

*ArenaX Technical Report v1.0 | April 2025*
*Built for India's Gaming Revolution 🇮🇳🎮*
*Solo Developer Edition — Scalable to 1M Users*
