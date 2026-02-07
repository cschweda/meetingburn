# Meeting Cost Calculator - Design Document

**Project Code Name:** MeetCost  
**Target Domain:** meetcost.app  
**Version:** 1.0.0  
**Date:** February 7, 2026  
**Author:** Chris Schweda  

---

## Executive Summary

MeetCost is a real-time meeting cost calculator web application designed to make invisible meeting waste painfully visible. By displaying a live-ticking counter showing dollar-per-second burn rates, the app creates shareable "shock moments" that drive behavior change in corporate meeting culture. Built as a personal project separate from ICJIA branding.

**Core Value Proposition:** Transform abstract meeting time into concrete financial data with viral shareability.

**Deployment Model:** Static-first hybrid app (no backend required for Phases 1-3)

**Quick Reference:**
- **Phase 1 (12-16h):** Working calculator → Deploy static
- **Phase 2 (20-24h):** Viral features → Deploy static  
- **Phase 3 (28-32h):** Analytics/history → Deploy static
- **Phase 4 (40+h):** Advanced features → Deploy static or hybrid

---

## Technology Stack

### Core Framework
- **Nuxt 4.3.x** (latest stable, currently 4.3.0 as of Jan 22, 2026)
- **Nuxt UI v4.x** (latest, fully open-source with 125+ components)
- **Vue 3** (via Nuxt)
- **TypeScript** (strict mode enabled)

### Package Management
- **Yarn 1.22.22** (classic, per ICJIA standards)

### Key Dependencies
- **@nuxt/ui** (v4.x - UI component library)
- **Tailwind CSS v4** (integrated via Nuxt UI)
- **@nuxt/icon** (icon system via Iconify)
- **@nuxtjs/color-mode** (dark mode support)
- **@vueuse/core** (composables for timer, localStorage, etc.)

### Optional/Future
- **nuxt-og-image** (social share images)
- **@nuxt/fonts** (optimized typography)
- **Chart.js** or **Recharts** (for analytics phase)

### Deployment
- **Netlify** (SSR mode via serverless functions)
- **Domain:** meetcost.app

---

## Project Name & Branding

### Primary Option: **MeetCost**
- **URL:** meetcost.app
- **Tagline:** "Watch your meeting dollars burn"
- **Rationale:** Direct, memorable, conveys urgency without being too jokey

### Alternative Names (in priority order)

1. **MeetingMeter**
   - meetingmeter.metaincognita.com
   - Pro: Clear, professional
   - Con: Less punchy

2. **ClockCost** 
   - clockcost.metaincognita.com
   - Pro: Alliterative, simple
   - Con: Generic

3. **WasteClock**
   - wasteclock.metaincognita.com
   - Pro: Provocative
   - Con: Might be too negative

4. **MinuteMoney**
   - minutemoney.metaincognita.com
   - Pro: Rhymes, catchy
   - Con: Less urgent feel

5. **ConfereCost** 
   - conferecost.metaincognita.com
   - Pro: Professional sounding
   - Con: Too formal for viral appeal

**Recommendation:** Proceed with **MeetCost** as primary brand.

---

## Design Phases & Deployment Strategy

**Deployment Architecture:** This app is **client-side first** with optional SSR for SEO. Each phase results in a fully functional, deployable application.

**Netlify Deployment Options:**
1. **Static Site Generation (SSG)** - Pre-rendered HTML, fastest, cheapest
2. **Server-Side Rendering (SSR)** - Dynamic rendering via Netlify Functions (serverless)
3. **Hybrid** - Static pages + client-side apps (recommended for this project)

**Our Approach:** Hybrid deployment using Nuxt 4's route rules:
- Landing/About pages: Pre-rendered (SSG) for fast loading and SEO
- Calculator/History: Client-side only (no server needed)
- No backend API required (all data stays in browser localStorage)
- Deployment: `yarn build` → uploads to Netlify → done

**Why This Works:**
- No server costs (static hosting is free on Netlify)
- No serverless functions needed (no API endpoints)
- All logic runs in browser (privacy-first)
- Instant global CDN distribution
- Automatic HTTPS and domain management

---

### Phase 1: MVP Foundation (Weekend - 12-16 hours)
**Goal:** Working calculator with real-time ticker and basic sharing

**Deployment:** ✅ Fully Static + Client-Side App

**Deliverables:**
- [ ] Project scaffold with Nuxt 4.3 + Nuxt UI v4
- [ ] Landing page with value proposition (SSG)
- [ ] Calculator setup form with Quick Mode
- [ ] Live counter component (1-second updates)
- [ ] Basic meeting cost calculation
- [ ] Text-based receipt (Markdown + Plain Text)
- [ ] Copy to clipboard functionality
- [ ] Basic error handling
- [ ] Responsive design (mobile-first)
- [ ] Accessibility basics (keyboard nav, ARIA labels)

**What Works After Phase 1:**
- ✅ User can start a meeting and see real-time cost
- ✅ User can stop meeting and get cost summary
- ✅ User can copy receipt as text
- ✅ Basic pause/resume functionality
- ✅ Works on all devices

**Deployment Steps:**
```bash
# Build for production
yarn build

# Netlify auto-detects Nuxt and deploys
# Or manual: netlify deploy --prod
```

**Netlify Configuration (netlify.toml):**
```toml
[build]
  command = "yarn build"
  publish = ".output/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Success Criteria:**
- [ ] App loads in < 2 seconds
- [ ] Calculator accurately tracks costs
- [ ] Receipt generation works
- [ ] Mobile responsive
- [ ] Deployed at meetcost.app

**Deployment Type:** Static with client-side JavaScript (no serverless needed)

---

### Phase 2: Viral Features (Week 2 - 20-24 hours)
**Goal:** Polish UI and add shareability features

**Deployment:** ✅ Fully Static + Client-Side App (no changes)

**Deliverables:**
- [ ] Visual polish (animations, transitions)
- [ ] Industry presets (6 presets: Tech, Gov, Agency, etc.)
- [ ] Employment type selector (full-time/contractor/unknown)
- [ ] Canvas-based receipt image generator (PNG export)
- [ ] Native share API integration
- [ ] Comparison metrics ("This meeting = X hours of consultant time")
- [ ] Color-coded cost thresholds (green/yellow/red)
- [ ] Milestone alerts ($500, $1K, $5K)
- [ ] Basic localStorage history (save last 10 meetings)
- [ ] Share link with URL-encoded data

**What Works After Phase 2:**
- ✅ Everything from Phase 1, plus:
- ✅ Beautiful, shareable receipt images
- ✅ One-tap sharing to social media
- ✅ Quick setup with industry presets
- ✅ Meeting history (last 10 meetings)
- ✅ Share links with embedded receipt data

**New Features:**
- Share URL: `/share?r=<base64-receipt-data>` (client-side decoding)
- PNG image generation (client-side Canvas API)
- Social share via navigator.share API

**Deployment Steps:**
```bash
# Same as Phase 1
yarn build
netlify deploy --prod

# Or auto-deploy via Git integration
git push origin main  # Auto-deploys to Netlify
```

**Success Criteria:**
- [ ] Receipt images look professional
- [ ] Share functionality works on mobile
- [ ] Presets pre-fill accurately
- [ ] Page loads remain < 2 seconds
- [ ] All Phase 1 features still work

**Deployment Type:** Still static (Canvas/Share APIs are browser APIs)

---

### Phase 3: Analytics & Intelligence (Week 3-4 - 28-32 hours)
**Goal:** Add meeting history, trends, and export capabilities

**Deployment:** ✅ Fully Static + Client-Side App (no changes)

**Deliverables:**
- [ ] Full meeting history page (/history)
- [ ] LocalStorage management (4MB limit, auto-cleanup)
- [ ] History filtering (date, cost, participants)
- [ ] History search (by notes)
- [ ] Cost trend visualization (Chart.js)
- [ ] Summary statistics cards
- [ ] CSV export (summary + detailed)
- [ ] "Most expensive meeting" highlight
- [ ] Recurring meeting cost projections
- [ ] Weekly/monthly summaries
- [ ] Dark mode implementation
- [ ] Export all data as JSON backup

**What Works After Phase 3:**
- ✅ Everything from Phase 1 & 2, plus:
- ✅ Complete meeting history with analytics
- ✅ Visual trend charts
- ✅ Data export in multiple formats
- ✅ Dark mode for better UX
- ✅ Smart storage management

**Technical Additions:**
- Chart.js for visualizations (lazy loaded)
- Enhanced localStorage composable
- CSV generation (client-side)
- JSON export/import

**Deployment Steps:**
```bash
# Same as previous phases
yarn build
git push origin main  # Auto-deploy
```

**Bundle Size Watch:**
- Chart.js adds ~100KB (lazy loaded)
- Target: < 250KB total JS (gzipped)
- Use code splitting for /history route

**Success Criteria:**
- [ ] History page loads < 3 seconds
- [ ] Charts render smoothly
- [ ] CSV export works correctly
- [ ] Storage management prevents data loss
- [ ] Dark mode has no visual bugs

**Deployment Type:** Still fully static (all processing client-side)

---

### Phase 4: Advanced Features (Future - 40+ hours)
**Goal:** Premium features and optional integrations

**Deployment:** ⚠️ **May require serverless** (depending on features)

**Deliverables:**
- [ ] Calendar integration (Google/Outlook OAuth)
- [ ] Auto-fetch meeting attendees from calendar
- [ ] Recurring meeting auto-detection
- [ ] Browser extension (Chrome/Firefox)
- [ ] Team/organization accounts (optional backend)
- [ ] Meeting templates library
- [ ] Advanced analytics (efficiency scoring)
- [ ] Optional: Public leaderboard (requires backend)

**What Works After Phase 4:**
- ✅ Everything from Phases 1-3, plus:
- ✅ Automatic meeting import from calendar
- ✅ Browser extension for Zoom/Meet overlay
- ✅ Advanced analytics and insights
- ✅ (Optional) Team collaboration features

**Deployment Considerations:**

**Option A: Keep It Static (Recommended)**
- Calendar integration: Client-side OAuth flow
- Extension: Standalone (uses local storage sync)
- No backend needed
- **Deployment:** Same as Phase 3 (static)

**Option B: Add Serverless (If Needed)**
- For team accounts: Add Netlify Functions
- For public leaderboard: Add database (Supabase/PlanetScale)
- OAuth token refresh: Serverless function

**If Serverless Added:**
```toml
# netlify.toml
[build]
  command = "yarn build"
  publish = ".output/public"

[functions]
  directory = ".output/server"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

**Nuxt Config Update:**
```typescript
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/calculate': { ssr: false },
    '/history': { ssr: false },
    '/api/**': { cors: true }  // Only if serverless added
  }
})
```

**Success Criteria:**
- [ ] Calendar integration works
- [ ] Extension installs and functions
- [ ] Performance remains acceptable
- [ ] Privacy guarantees maintained

**Deployment Type:** Static + optional serverless (only if team features needed)

---

## Deployment Summary by Phase

| Phase | Type | Netlify Build | Serverless | Cost |
|-------|------|---------------|------------|------|
| 1 - MVP | Static + Client | `yarn build` | ❌ No | Free |
| 2 - Viral | Static + Client | `yarn build` | ❌ No | Free |
| 3 - Analytics | Static + Client | `yarn build` | ❌ No | Free |
| 4 - Advanced | Hybrid (optional) | `yarn build` | ⚠️ Optional | Free-$19/mo |

**Key Points:**
- **Phases 1-3:** Fully static, zero server costs, deploy in seconds
- **Phase 4:** Can remain static (recommended) or add serverless for team features
- **All phases:** Use Netlify's automatic Git deployment
- **No backend needed:** All data stays in browser (privacy-first)

**Why This Approach Works:**
1. **Fast Development:** No backend to build/maintain
2. **Zero Cost:** Static hosting is free on Netlify
3. **Global Performance:** CDN distribution worldwide
4. **Privacy-First:** No data leaves user's device
5. **Easy Deployment:** `git push` = automatic deploy
6. **Scalable:** Can handle millions of users (static = infinite scale)

---

## Architecture Overview

### Directory Structure (Nuxt 4 app/ convention)

```
burnrate/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Global styles
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── LiveCounter.vue   # Real-time ticker
│   │   │   ├── SetupForm.vue     # Meeting configuration
│   │   │   ├── Receipt.vue       # Shareable output
│   │   │   └── PresetPicker.vue  # Industry presets
│   │   ├── analytics/
│   │   │   ├── CostChart.vue     # Trend visualization
│   │   │   ├── MeetingList.vue   # History table
│   │   │   └── StatsCard.vue     # Summary metrics
│   │   └── shared/
│   │       ├── Header.vue
│   │       └── Footer.vue
│   ├── composables/
│   │   ├── useCalculator.ts      # Core calculation logic
│   │   ├── useMeetingHistory.ts  # LocalStorage persistence
│   │   ├── useReceipt.ts         # Image generation
│   │   └── usePresets.ts         # Industry defaults
│   ├── layouts/
│   │   ├── default.vue
│   │   └── calculator.vue        # Full-screen calculator view
│   ├── pages/
│   │   ├── index.vue             # Landing page
│   │   ├── calculate.vue         # Main calculator
│   │   ├── history.vue           # Meeting history
│   │   ├── about.vue             # Project info
│   │   └── share/
│   │       └── index.vue         # Shared receipt view (receipt data in URL query param)
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── calculations.ts       # Cost formulas
│   │   ├── comparisons.ts        # Fun metrics
│   │   └── formatting.ts         # Currency/time display
│   ├── app.vue
│   └── app.config.ts
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── icons/
├── nuxt.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── yarn.lock
```

---

## Core Data Models

### Meeting Interface

```typescript
type EmploymentType = 'fulltime' | 'contractor' | 'unknown'

interface Meeting {
  id: string                    // UUID
  timestamp: number              // Unix timestamp (start time)
  duration: number               // Seconds (actual duration)
  plannedDuration?: number       // Optional: expected duration in seconds
  participants: Participant[]
  totalCost: number
  costPerSecond: number
  costPerMinute: number
  averageRate: number            // Blended hourly rate
  status: 'setup' | 'running' | 'paused' | 'completed'
  notes?: string
  preset?: PresetType
}

interface Participant {
  id: string
  employmentType: EmploymentType
  // For full-time employees
  annualSalary?: number
  // For contractors OR unknown (fallback to hourly)
  hourlyRate?: number
  // Computed hourly rate (regardless of type)
  effectiveHourlyRate: number
  role?: string                  // Optional role label
  isActive: boolean              // For dynamic add/remove
}

type PresetType = 'tech' | 'consulting' | 'government' | 'agency' | 'corporate' | 'startup' | 'custom'

interface Preset {
  type: PresetType
  label: string
  defaultEmploymentType: EmploymentType
  averageSalary?: number         // Annual (for full-time)
  averageRate: number            // Hourly (computed or direct)
  description: string
  color: string                  // Tailwind color class
}

interface Receipt {
  id: string
  meeting: Meeting
  comparisonMetric: string       // "47 hours of consultant time"
  generatedAt: number
  imageUrl?: string              // Base64 data URL (client-side only; no server storage)
  exports?: {
    markdown?: string
    plainText?: string
    csv?: string
  }
}

// Helper function
const calculateHourlyRate = (participant: Participant): number => {
  if (participant.employmentType === 'fulltime' && participant.annualSalary) {
    return participant.annualSalary / 2080  // 40hrs/week × 52 weeks (standard calculation)
  }
  return participant.hourlyRate || 0
}

// Duration formatting helper
interface DurationFormat {
  hours: number
  minutes: number
  seconds: number
  totalMinutes: number
  readable: string  // "1 hour 23 minutes" or "47 minutes"
}

const formatDuration = (seconds: number): DurationFormat => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return {
    hours,
    minutes,
    seconds: secs,
    totalMinutes: Math.floor(seconds / 60),
    readable: hours > 0 
      ? `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`
      : `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }
}
```

---

## UI/UX Flows

### Design Philosophy: Big & Bold

**Core Principles:**
- **Touch-friendly targets:** Minimum 44px height (Apple HIG standard)
- **Large, readable text:** Minimum 16px base font (prevents mobile zoom)
- **Clear visual hierarchy:** Important actions are unmissable
- **Sensible defaults:** Pre-filled with most common options
- **Progressive disclosure:** Advanced options available but not required

**Accessibility Standards:**
- All interactive elements keyboard navigable
- Color contrast ≥ 4.5:1 for text
- Focus indicators highly visible (3px outline)
- Screen reader labels for all inputs
- No timeout-based interactions

---

### Flow 0: Employment Type Selection (New)

**Single Participant Setup - Large Card Interface:**

```
┌─────────────────────────────────────────────┐
│  PARTICIPANT 1                               │
├─────────────────────────────────────────────┤
│                                              │
│  EMPLOYEE TYPE:                              │
│                                              │
│  ┌──────────────┐  ┌──────────────┐        │
│  │  👔          │  │  💼          │        │
│  │  FULL-TIME   │  │  CONTRACTOR  │        │
│  │              │  │              │        │
│  │  Salaried    │  │  Hourly      │        │
│  │  employee    │  │  rate        │        │
│  └──────────────┘  └──────────────┘        │
│  [Large button]    [Large button]          │
│     120px wide        120px wide            │
│                                              │
│  ┌──────────────────────────────┐           │
│  │  ❓ UNKNOWN / ESTIMATE        │           │
│  │                              │           │
│  │  Use hourly rate estimate   │           │
│  └──────────────────────────────┘           │
│  [Wide button - 280px]                      │
│                                              │
├─────────────────────────────────────────────┤
│  [If FULL-TIME selected]                    │
│                                              │
│  ANNUAL SALARY                               │
│  ┌────────────────────────────┐             │
│  │  $  [    80,000    ]       │  [56px tall]│
│  └────────────────────────────┘             │
│  → Calculated rate: $40.00/hr               │
│  [18px gray text]                           │
│                                              │
├─────────────────────────────────────────────┤
│  [If CONTRACTOR or UNKNOWN selected]        │
│                                              │
│  HOURLY RATE                                 │
│  ┌────────────────────────────┐             │
│  │  $  [    125.00    ] /hr   │  [56px tall]│
│  └────────────────────────────┘             │
│                                              │
├─────────────────────────────────────────────┤
│  ROLE (OPTIONAL)                             │
│  ┌────────────────────────────┐             │
│  │  [  e.g., Manager, Dev  ]  │  [48px tall]│
│  └────────────────────────────┘             │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │  ➕ ADD ANOTHER PARTICIPANT          │   │
│  └──────────────────────────────────────┘   │
│  [52px tall button]                         │
│                                              │
└─────────────────────────────────────────────┘
```

**Quick Mode Enhancement - Large Touch Targets:**

```
┌─────────────────────────────────────────────┐
│  QUICK SETUP                                 │
├─────────────────────────────────────────────┤
│                                              │
│  NUMBER OF PEOPLE                            │
│  ┌────────────────────────────┐             │
│  │  [      8      ]           │  [56px tall]│
│  └────────────────────────────┘             │
│  [Large input - 24px font]                  │
│                                              │
│  AVERAGE COMPENSATION TYPE                   │
│                                              │
│  ┌──────────────┐  ┌──────────────┐        │
│  │  📊 SALARY   │  │  💵 HOURLY   │        │
│  │              │  │              │        │
│  │  Annual      │  │  Per hour    │        │
│  │  $75,000     │  │  $75/hr      │        │
│  └──────────────┘  └──────────────┘        │
│  [120px × 100px]   [120px × 100px]         │
│                                              │
│  [Big input appears based on selection]     │
│  ┌────────────────────────────┐             │
│  │  $  [    75,000    ]       │  [56px tall]│
│  └────────────────────────────┘             │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │       START MEETING →                │   │
│  │       [60px tall CTA button]          │   │
│  │       [24px font, bold]               │   │
│  └──────────────────────────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘
```

---

### Flow 1: First-Time User - Quick Start

```
User lands on homepage
    ↓
Sees hero: "Watch your meeting dollars burn in real-time"
    ↓
CTA: "Start Tracking Now" button
    ↓
CALCULATOR SETUP MODAL opens
    ↓
Two options presented:
    → Quick Mode: "Number of people" + "Average hourly rate" 
    → Advanced Mode: "Add individual participants with roles/rates"
    ↓
User selects QUICK MODE:
    → Enters: 8 people
    → Enters: $75/hour average (or selects preset)
    ↓
"Start Meeting" button becomes active
    ↓
CLICK → Navigates to /calculate
```

---

### Flow 2: Calculator Screen - Live Meeting

```
/calculate page loads
    ↓
Full-screen ticker display shows:
    ┌─────────────────────────────────────────────┐
    │        MEETING IN PROGRESS                   │
    │                                              │
    │              $2,847.23                       │
    │              [Giant counter]                 │
    │              [72px font, bold]               │
    │                                              │
    │            +$1.67 per second                 │
    │            [24px font, medium]               │
    │                                              │
    │         ⏱️  28:14 elapsed                    │
    │         📅 Started at 2:30 PM                │
    │         [20px font, gray]                    │
    │                                              │
    │  ┌────────────────┐  ┌────────────────┐    │
    │  │  ⏸️  PAUSE     │  │  ⏹️  STOP       │    │
    │  │  [52px tall]   │  │  [52px tall]    │    │
    │  └────────────────┘  └────────────────┘    │
    │                                              │
    │  ┌──────────────────────────────────────┐   │
    │  │  ➕ ADD PARTICIPANT (mid-meeting)    │   │
    │  │  [48px tall]                         │   │
    │  └──────────────────────────────────────┘   │
    │                                              │
    └─────────────────────────────────────────────┘
    ↓
Counter ticks up every second
Colors change dynamically:
  - $0-500 (green bg, dark green text)
  - $501-2000 (yellow bg, dark yellow text)
  - $2001+ (red bg, dark red text)
    ↓
User watches in horror as cost climbs
    ↓
[Optional] Milestone alert: 
    🔔 "$1,000 milestone reached!"
    [Toast notification, top-right, 3 second duration]
    ↓
User clicks "PAUSE" (optional)
    ↓
Counter freezes, button changes to "▶️ RESUME"
Timer shows: "⏸️ Paused at 28:14"
    ↓
User clicks "RESUME" or "STOP MEETING"
    ↓
If STOP: Counter freezes at final cost
    ↓
Receipt generation screen appears
```

---

### Flow 3: Receipt Generation & Sharing

```
Meeting ends → Receipt preview appears:
    ↓
Receipt displays (large, readable format):
    ┌─────────────────────────────────────────────┐
    │            💸 MEETING RECEIPT                │
    ├─────────────────────────────────────────────┤
    │  February 7, 2026 • 2:30 PM                  │
    │  [16px font, gray]                           │
    │                                              │
    │  ⏱️  DURATION: 1 hour 23 minutes            │
    │     (83 minutes)                             │
    │     [20px font, bold]                        │
    │                                              │
    │  👥 ATTENDEES: 8 people                      │
    │     • 5 full-time employees                  │
    │     • 2 contractors                          │
    │     • 1 unknown/estimated                    │
    │     [18px font]                              │
    │                                              │
    │  💰 AVERAGE RATE: $52.30/hour                │
    │     Blended rate across all attendees        │
    │     [18px font]                              │
    │                                              │
    ├─────────────────────────────────────────────┤
    │                                              │
    │           TOTAL COST                         │
    │          $5,947.23                           │
    │          [48px font, bold, red]              │
    │                                              │
    ├─────────────────────────────────────────────┤
    │                                              │
    │  💡 FUN FACT:                                │
    │  This meeting cost the same as:              │
    │  • 170 hours of consultant time              │
    │  • 49 training course seats                  │
    │  • 1.2 round-trip flights to NYC             │
    │  [16px font, light gray]                     │
    │                                              │
    ├─────────────────────────────────────────────┤
    │                                              │
    │  📊 IF REPEATED WEEKLY:                      │
    │  Annual cost: $309,256                       │
    │  [18px font, bold]                           │
    │                                              │
    ├─────────────────────────────────────────────┤
    │                                              │
    │  Per-minute burn rate: $71.65/min            │
    │  Per-second burn rate: $1.19/sec             │
    │  [16px font, gray]                           │
    │                                              │
    ├─────────────────────────────────────────────┤
    │  Tracked with MeetCost                       │
    │  meetcost.app                  │
    │  [14px font, very light gray]                │
    └─────────────────────────────────────────────┘
    ↓
Large action buttons presented:
    ┌─────────────────────────────────────────────┐
    │  SHARE OR EXPORT                             │
    ├─────────────────────────────────────────────┤
    │                                              │
    │  ┌────────────────────────────────────────┐ │
    │  │  📸  SAVE AS IMAGE (PNG)               │ │
    │  │  [52px tall button]                    │ │
    │  └────────────────────────────────────────┘ │
    │                                              │
    │  ┌────────────────────────────────────────┐ │
    │  │  📄  COPY AS MARKDOWN                  │ │
    │  │  [52px tall button]                    │ │
    │  └────────────────────────────────────────┘ │
    │                                              │
    │  ┌────────────────────────────────────────┐ │
    │  │  📝  COPY AS PLAIN TEXT                │ │
    │  │  [52px tall button]                    │ │
    │  └────────────────────────────────────────┘ │
    │                                              │
    │  ┌────────────────────────────────────────┐ │
    │  │  📊  EXPORT AS CSV                     │ │
    │  │  [52px tall button]                    │ │
    │  └────────────────────────────────────────┘ │
    │                                              │
    │  ┌────────────────────────────────────────┐ │
    │  │  🔗  SHARE LINK                        │ │
    │  │  [52px tall button]                    │ │
    │  └────────────────────────────────────────┘ │
    │                                              │
    │  ┌────────────────────────────────────────┐ │
    │  │  💾  SAVE TO HISTORY                   │ │
    │  │  [52px tall button, primary color]     │ │
    │  └────────────────────────────────────────┘ │
    │                                              │
    │  ┌────────────────────────────────────────┐ │
    │  │  🔄  START NEW MEETING                 │ │
    │  │  [52px tall button, secondary]         │ │
    │  └────────────────────────────────────────┘ │
    │                                              │
    └─────────────────────────────────────────────┘
    ↓
User clicks "COPY AS MARKDOWN"
    ↓
Markdown formatted text copied to clipboard
    ↓
Toast notification appears:
    "✓ Copied as Markdown"
    [Top-right, 2 seconds]
    ↓
User clicks "SAVE AS IMAGE"
    ↓
Canvas generates styled PNG (800×1000px, 2x resolution)
    ↓
Native download/share sheet opens
    ↓
User shares to Slack/Twitter/LinkedIn OR downloads
    ↓
Receipt also auto-saved to localStorage history
```

---

### Flow 4: Returning User - History & Analytics

```
User returns to homepage
    ↓
Navigation shows: [Calculator] [History] [About]
    ↓
Clicks "History"
    ↓
/history page displays:
    ┌─────────────────────────────────┐
    │     MEETING HISTORY              │
    ├─────────────────────────────────┤
    │  📊 This Month: $47,890          │
    │  📈 vs Last Month: +18%          │
    ├─────────────────────────────────┤
    │  💰 Most Expensive:              │
    │  "Q3 Planning" - $8,440          │
    │  Feb 3, 2026 • 2h 45m            │
    ├─────────────────────────────────┤
    │  RECENT MEETINGS:                │
    │  ─────────────────────────────── │
    │  Feb 7 • Standup • $240          │
    │  Feb 6 • Strategy • $3,200       │
    │  Feb 5 • Retro • $1,100          │
    │  [View all...]                   │
    └─────────────────────────────────┘
    ↓
User clicks on a meeting entry
    ↓
Detailed view opens with:
    - Full receipt
    - Participant breakdown
    - Notes (if any)
    - Re-share options
```

---

### Flow 5: Industry Preset Selection

```
Calculator setup screen
    ↓
User clicks "Use Industry Preset"
    ↓
Modal displays preset cards (large, touch-friendly):
    ┌────────────────────────────────────────────┐
    │  💻 TECH / SOFTWARE                         │
    │  Full-time • Avg: $95,000/year              │
    │  (= $47.50/hour)                            │
    │  Engineers, PMs, Designers                  │
    │  [120px × 100px card]                       │
    └────────────────────────────────────────────┘
    ┌────────────────────────────────────────────┐
    │  📊 CONSULTING                              │
    │  Contractor • Avg: $125/hour                │
    │  Strategy, Analysis, Advisory               │
    │  [120px × 100px card]                       │
    └────────────────────────────────────────────┘
    ┌────────────────────────────────────────────┐
    │  🏛️ GOVERNMENT / PUBLIC SECTOR             │
    │  Full-time • Avg: $65,000/year              │
    │  (= $32.50/hour)                            │
    │  State employees, Public agencies           │
    │  [120px × 100px card]                       │
    └────────────────────────────────────────────┘
    ┌────────────────────────────────────────────┐
    │  🎨 AGENCY / CREATIVE                       │
    │  Full-time • Avg: $85,000/year              │
    │  (= $42.50/hour)                            │
    │  Marketing, Design, Content                 │
    │  [120px × 100px card]                       │
    └────────────────────────────────────────────┘
    ┌────────────────────────────────────────────┐
    │  🏢 CORPORATE                                │
    │  Full-time • Avg: $75,000/year              │
    │  (= $37.50/hour)                            │
    │  General business, Operations               │
    │  [120px × 100px card]                       │
    └────────────────────────────────────────────┘
    ┌────────────────────────────────────────────┐
    │  🚀 STARTUP                                 │
    │  Full-time • Avg: $65,000/year              │
    │  (= $32.50/hour)                            │
    │  Early stage, bootstrapped                  │
    │  [120px × 100px card]                       │
    └────────────────────────────────────────────┘
    ↓
User selects "GOVERNMENT / PUBLIC SECTOR"
    ↓
Form pre-fills with:
    - Employment Type: Full-Time (selected)
    - Annual Salary: $65,000
    - Calculated hourly: $32.50/hour
    ↓
User can adjust or proceed with defaults
    ↓
Click "Continue" or "Start Meeting"
```

---

## Component Specifications

### 1. LiveCounter.vue

**Purpose:** The core real-time cost display with pause/resume functionality

**Props:**
```typescript
interface LiveCounterProps {
  costPerSecond: number
  isRunning: boolean
  isPaused: boolean
  startTime: number
  duration?: number  // For replay mode
  showDuration?: boolean  // Default: true
}
```

**Emits:**
```typescript
{
  stop: () => void
  pause: () => void
  resume: () => void
  milestone: (amount: number) => void
  addParticipant: () => void
}
```

**Features:**
- Updates every 1 second (1000ms) for real-time feel with good performance
- CSS animation for smooth number transitions between updates
- Color transitions at cost thresholds ($0-500 green, $501-2000 yellow, $2001+ red)
- Milestone detection ($500, $1K, $5K, $10K)
- Sound effects (optional, user-togglable in settings)
- Pause/resume capability with clear state indicators
- Duration tracking and display (elapsed time)
- Fullscreen mode option
- Large, bold typography (72px for cost, 24px for rate)

**State Management:**
```typescript
const currentCost = ref(0)
const elapsedSeconds = ref(0)
const isPausedState = ref(false)
const pausedAt = ref<number | null>(null)
const milestones = [500, 1000, 5000, 10000]
const reachedMilestones = ref<number[]>([])

// Composable usage
const { 
  start, 
  stop, 
  pause, 
  resume, 
  reset,
  getElapsedTime,
  getCurrentCost 
} = useCalculator()
```

**UI Specifications:**
- Minimum touch target size: 52px tall buttons
- Font sizes: 72px (cost), 24px (rate), 20px (duration)
- Color coding with sufficient contrast (WCAG AA)
- Animated number transitions (smooth counting)
- Clear pause state indication (⏸️ icon, muted colors)

---

### 2. Receipt.vue

**Purpose:** Generate shareable meeting summary with multiple export formats

**Props:**
```typescript
interface ReceiptProps {
  meeting: Meeting
  showComparison?: boolean  // Default: true
  showDuration?: boolean    // Default: true
  showBreakdown?: boolean   // Default: true (employment types)
  format?: 'preview' | 'export'  // Default: 'preview'
}
```

**Features:**
- Canvas-based image generation (800×1000px, 2x resolution)
- Multiple comparison metrics (random selection for variety)
- QR code to receipt URL (optional)
- Watermark: "Tracked with MeetCost"
- Copy to clipboard functionality (Markdown, Plain Text)
- Native share API integration
- CSV export with participant detail option
- Multiple color themes (light/dark/brand)
- Duration display with human-readable format
- Employment type breakdown (full-time/contractor/unknown)
- Large, readable typography (20px+ for key info)

**Export Options:**
```typescript
interface ExportOptions {
  format: 'image' | 'markdown' | 'text' | 'csv'
  includeParticipants?: boolean  // For CSV detail
  includeComparisons?: boolean
  theme?: 'light' | 'dark' | 'brand'
}
```

**Image Export Specs:**
- Size: 800×1000px base (1600×2000px at 2x for retina)
- Format: PNG with transparency
- Resolution: 2x for retina displays
- Compression: Optimized for web (<200KB)
- Font: System font stack with fallbacks

**Component Methods:**
```typescript
const exportAsImage = async (): Promise<Blob>
const exportAsMarkdown = (): string
const exportAsText = (): string
const exportAsCSV = (detailed: boolean): string
const copyToClipboard = async (format: string): Promise<void>
const shareNative = async (): Promise<void>
const downloadFile = (filename: string, mimeType: string): void
```

---

### 3. SetupForm.vue

**Purpose:** Configure meeting parameters before starting

**Features:**
- Quick mode vs Advanced mode toggle
- **Employment type selector (full-time/contractor/unknown)**
- **Conditional input fields based on employment type:**
  - Full-time: Annual salary input (calculates hourly)
  - Contractor/Unknown: Direct hourly rate input
- Industry preset picker (with employment defaults)
- Dynamic participant add/remove
- Salary validation ($20,000-$500,000 annual range)
- Hourly rate validation ($10-$500 range)
- Role labels (optional text input)
- Save as template option
- Recent configurations dropdown
- **Large touch targets (52px+ buttons)**
- **Clear visual hierarchy**
- **Pre-filled sensible defaults**

**Validation Rules:**
```typescript
const validationSchema = {
  participants: {
    min: 1,
    max: 50,
    required: true
  },
  annualSalary: {
    min: 20000,
    max: 500000,
    required: (employmentType: string) => employmentType === 'fulltime'
  },
  hourlyRate: {
    min: 10,
    max: 500,
    required: (employmentType: string) => 
      employmentType === 'contractor' || employmentType === 'unknown'
  },
  role: {
    maxLength: 50,
    required: false
  }
}
```

**Sensible Defaults:**
```typescript
const defaults = {
  numberOfPeople: 5,
  employmentType: 'fulltime',
  annualSalary: 65000,  // Government average
  hourlyRate: 75,
  duration: 60  // minutes
}
```

**Employment Type Cards:**
- Large, tappable cards (120px × 100px minimum)
- Clear icons and labels
- Visual feedback on selection
- Conditional form fields appear smoothly

---

### 4. MeetingHistory.vue

**Purpose:** Display past calculations with analytics

**Features:**
- Filterable list (date range, cost range)
- Sortable columns (date, duration, cost)
- Search by notes/tags
- Delete individual meetings
- Export all data (JSON/CSV)
- Summary statistics cards
- Cost trend chart (last 30 days)

**Data Display:**
```typescript
interface HistoryEntry {
  meeting: Meeting
  actions: {
    view: () => void
    share: () => void
    delete: () => void
    duplicate: () => void
  }
}
```

---

## Export Format Specifications

### Format Overview

MeetCost supports four export formats to maximize shareability and data portability:

1. **Image (PNG)** - Visual, shareable receipt (800×1000px, 2x resolution)
2. **Markdown** - Structured text with formatting for GitHub, Notion, etc.
3. **Plain Text** - Universal format for email, Slack, etc.
4. **CSV** - Data format for spreadsheets and analysis

---

### 1. Markdown Export

**Format:** GitHub Flavored Markdown (GFM)
**Use Case:** Documentation, wikis, team knowledge bases

```markdown
# Meeting Receipt 💸

**Date:** February 7, 2026 at 2:30 PM  
**Duration:** 1 hour 23 minutes (83 minutes)  
**Attendees:** 8 people  

## Breakdown
- 5 full-time employees
- 2 contractors  
- 1 unknown/estimated

**Average Rate:** $52.30/hour

---

## Total Cost: $5,947.23

---

### Fun Fact
This meeting cost the same as:
- 170 hours of consultant time
- 49 training course seats
- 1.2 round-trip flights to NYC

### If Repeated Weekly
Annual cost: **$309,256**

### Burn Rates
- Per-minute: $71.65/min
- Per-second: $1.19/sec

---

*Tracked with [MeetCost](https://meetcost.app)*
```

---

### 2. Plain Text Export

**Format:** UTF-8 encoded plain text
**Use Case:** Email, text files, basic Slack messages

```
MEETING RECEIPT
===============

Date: February 7, 2026 at 2:30 PM
Duration: 1 hour 23 minutes (83 minutes)
Attendees: 8 people

Breakdown:
- 5 full-time employees
- 2 contractors
- 1 unknown/estimated

Average Rate: $52.30/hour

----------------------------------------

TOTAL COST: $5,947.23

----------------------------------------

Fun Fact:
This meeting cost the same as:
- 170 hours of consultant time
- 49 training course seats
- 1.2 round-trip flights to NYC

If Repeated Weekly:
Annual cost: $309,256

Burn Rates:
- Per-minute: $71.65/min
- Per-second: $1.19/sec

Tracked with MeetCost
https://meetcost.app
```

---

### 3. CSV Export

**Format:** RFC 4180 compliant CSV
**Use Case:** Spreadsheet analysis, data aggregation

**Summary CSV (Single Row):**
```csv
Date,Time,Duration (minutes),Attendees,Full-Time,Contractors,Unknown,Average Rate,Total Cost,Cost Per Minute,Cost Per Second,Annual (Weekly),Generated At
"2026-02-07","14:30","83","8","5","2","1","$52.30","$5947.23","$71.65","$1.19","$309256","2026-02-07T14:30:00Z"
```

**Detailed CSV (With Participants):**
```csv
Meeting ID,Date,Time,Participant ID,Employment Type,Compensation Type,Salary/Rate,Hourly Rate,Role,Duration (min),Individual Cost
"mtg_20260207_1430","2026-02-07","14:30","p1","Full-Time","Salary","$80000","$40.00","Manager","83","$55.33"
"mtg_20260207_1430","2026-02-07","14:30","p2","Full-Time","Salary","$65000","$32.50","Analyst","83","$45.08"
"mtg_20260207_1430","2026-02-07","14:30","p3","Contractor","Hourly","$125.00","$125.00","Consultant","83","$173.33"
"mtg_20260207_1430","2026-02-07","14:30","p4","Unknown","Hourly","$75.00","$75.00","","83","$104.00"
```

**CSV Export Options (User Selectable):**
- Summary only (single row)
- Detailed with participants
- Include comparison metrics
- Include recurring projections

---

### 4. Image Export (PNG)

**Specifications:**
- **Dimensions:** 800×1000px base (1600×2000px at 2x for retina)
- **Format:** PNG with transparency support
- **File Size Target:** <200KB (optimized compression)
- **Color Space:** sRGB
- **Font:** System font stack (fallback to sans-serif)

**Canvas Generation Process:**
```typescript
// composables/useReceiptImage.ts
export const useReceiptImage = () => {
  const generateImage = async (meeting: Meeting): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const scale = 2  // Retina resolution
    
    canvas.width = 800 * scale
    canvas.height = 1000 * scale
    ctx.scale(scale, scale)
    
    // Draw background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 800, 1000)
    
    // Draw content (receipt layout)
    drawReceiptHeader(ctx, meeting)
    drawReceiptBody(ctx, meeting)
    drawReceiptFooter(ctx, meeting)
    
    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!)
      }, 'image/png', 0.95)
    })
  }
  
  const downloadImage = async (meeting: Meeting, filename: string) => {
    const blob = await generateImage(meeting)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const shareImage = async (meeting: Meeting) => {
    const blob = await generateImage(meeting)
    const file = new File([blob], 'meeting-receipt.png', { type: 'image/png' })
    
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `Meeting Cost: ${formatCurrency(meeting.totalCost)}`,
        text: `This meeting cost ${formatCurrency(meeting.totalCost)}`,
        files: [file]
      })
    } else {
      // Fallback to download
      await downloadImage(meeting, 'meeting-receipt.png')
    }
  }
  
  return { generateImage, downloadImage, shareImage }
}
```

---

### Export Composable Implementation

```typescript
// composables/useReceipt.ts
export const useReceipt = () => {
  const generateMarkdown = (meeting: Meeting): string => {
    const duration = formatDuration(meeting.duration)
    const breakdown = getParticipantBreakdown(meeting.participants)
    const comparison = generateComparison(meeting.totalCost)
    
    return `# Meeting Receipt 💸

**Date:** ${formatDate(meeting.timestamp)}  
**Duration:** ${duration.readable} (${duration.totalMinutes} minutes)  
**Attendees:** ${meeting.participants.length} people  

## Breakdown
${breakdown.fulltime > 0 ? `- ${breakdown.fulltime} full-time employees\n` : ''}${breakdown.contractor > 0 ? `- ${breakdown.contractor} contractors\n` : ''}${breakdown.unknown > 0 ? `- ${breakdown.unknown} unknown/estimated\n` : ''}
**Average Rate:** ${formatCurrency(meeting.averageRate)}/hour

---

## Total Cost: ${formatCurrency(meeting.totalCost)}

---

### Fun Fact
This meeting cost the same as:
${comparison}

### If Repeated Weekly
Annual cost: **${formatCurrency(meeting.totalCost * 52)}**

### Burn Rates
- Per-minute: ${formatCurrency(meeting.costPerMinute)}/min
- Per-second: ${formatCurrency(meeting.costPerSecond)}/sec

---

*Tracked with [MeetCost](https://meetcost.app)*`
  }

  const generatePlainText = (meeting: Meeting): string => {
    const duration = formatDuration(meeting.duration)
    const breakdown = getParticipantBreakdown(meeting.participants)
    const comparison = generateComparison(meeting.totalCost)
    
    return `MEETING RECEIPT
===============

Date: ${formatDate(meeting.timestamp)}
Duration: ${duration.readable} (${duration.totalMinutes} minutes)
Attendees: ${meeting.participants.length} people

Breakdown:
${breakdown.fulltime > 0 ? `- ${breakdown.fulltime} full-time employees\n` : ''}${breakdown.contractor > 0 ? `- ${breakdown.contractor} contractors\n` : ''}${breakdown.unknown > 0 ? `- ${breakdown.unknown} unknown/estimated\n` : ''}
Average Rate: ${formatCurrency(meeting.averageRate)}/hour

----------------------------------------

TOTAL COST: ${formatCurrency(meeting.totalCost)}

----------------------------------------

Fun Fact:
This meeting cost the same as:
${comparison}

If Repeated Weekly:
Annual cost: ${formatCurrency(meeting.totalCost * 52)}

Burn Rates:
- Per-minute: ${formatCurrency(meeting.costPerMinute)}/min
- Per-second: ${formatCurrency(meeting.costPerSecond)}/sec

Tracked with MeetCost
https://meetcost.app`
  }

  const generateCSV = (
    meeting: Meeting, 
    options: { 
      includeParticipants?: boolean
      includeComparisons?: boolean 
    } = {}
  ): string => {
    const duration = formatDuration(meeting.duration)
    const breakdown = getParticipantBreakdown(meeting.participants)
    
    if (options.includeParticipants) {
      // Detailed CSV with per-participant breakdown
      const rows = meeting.participants.map(p => {
        const individualCost = (p.effectiveHourlyRate * meeting.duration) / 3600
        return [
          meeting.id,
          formatDate(meeting.timestamp, 'YYYY-MM-DD'),
          formatTime(meeting.timestamp),
          p.id,
          p.employmentType,
          p.employmentType === 'fulltime' ? 'Salary' : 'Hourly',
          p.annualSalary ? formatCurrency(p.annualSalary) : formatCurrency(p.hourlyRate || 0),
          formatCurrency(p.effectiveHourlyRate),
          p.role || '',
          duration.totalMinutes,
          formatCurrency(individualCost)
        ].map(escapeCSV).join(',')
      })
      
      const header = 'Meeting ID,Date,Time,Participant ID,Employment Type,Compensation Type,Salary/Rate,Hourly Rate,Role,Duration (min),Individual Cost'
      return [header, ...rows].join('\n')
    } else {
      // Summary CSV (single row)
      const row = [
        formatDate(meeting.timestamp, 'YYYY-MM-DD'),
        formatTime(meeting.timestamp),
        duration.totalMinutes,
        meeting.participants.length,
        breakdown.fulltime,
        breakdown.contractor,
        breakdown.unknown,
        formatCurrency(meeting.averageRate),
        formatCurrency(meeting.totalCost),
        formatCurrency(meeting.costPerMinute),
        formatCurrency(meeting.costPerSecond),
        formatCurrency(meeting.totalCost * 52),
        new Date(meeting.timestamp).toISOString()
      ].map(escapeCSV).join(',')
      
      const header = 'Date,Time,Duration (minutes),Attendees,Full-Time,Contractors,Unknown,Average Rate,Total Cost,Cost Per Minute,Cost Per Second,Annual (Weekly),Generated At'
      return [header, row].join('\n')
    }
  }

  const escapeCSV = (value: string | number): string => {
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const copyToClipboard = async (content: string, format: string) => {
    await navigator.clipboard.writeText(content)
    // Toast notification handled by UI
    return true
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    generateMarkdown,
    generatePlainText,
    generateCSV,
    copyToClipboard,
    downloadFile
  }
}

// Helper: Get participant breakdown by employment type
const getParticipantBreakdown = (participants: Participant[]) => {
  return {
    fulltime: participants.filter(p => p.employmentType === 'fulltime').length,
    contractor: participants.filter(p => p.employmentType === 'contractor').length,
    unknown: participants.filter(p => p.employmentType === 'unknown').length
  }
}
```

---

## Calculation Logic

### Core Formula

```typescript
// Basic calculation - use effectiveHourlyRate (works for full-time, contractor, unknown)
// and filter to active participants only
const calculateMeetingCost = (
  participants: Participant[],
  durationSeconds: number
): number => {
  const totalHourlyRate = participants
    .filter((p) => p.isActive)
    .reduce((sum, p) => sum + p.effectiveHourlyRate, 0)
  const costPerSecond = totalHourlyRate / 3600
  return costPerSecond * durationSeconds
}

// Real-time ticker
const costPerSecond = totalHourlyRate / 3600
const currentCost = computed(() => 
  costPerSecond * elapsedSeconds.value
)
```

### Industry Presets

```typescript
const PRESETS: Record<PresetType, Preset> = {
  tech: {
    type: 'tech',
    label: 'Tech / Software',
    defaultEmploymentType: 'fulltime',
    averageSalary: 95000,
    averageRate: 45.67,  // 95000 / 2080
    description: 'Engineers, PMs, Designers',
    color: 'blue'
  },
  consulting: {
    type: 'consulting',
    label: 'Consulting',
    defaultEmploymentType: 'contractor',
    averageRate: 125,
    description: 'Strategy, Analysis, Advisory',
    color: 'purple'
  },
  government: {
    type: 'government',
    label: 'Government / Public Sector',
    defaultEmploymentType: 'fulltime',
    averageSalary: 65000,
    averageRate: 31.25,  // 65000 / 2080
    description: 'State employees, Public agencies',
    color: 'slate'
  },
  agency: {
    type: 'agency',
    label: 'Agency / Creative',
    defaultEmploymentType: 'fulltime',
    averageSalary: 85000,
    averageRate: 40.87,  // 85000 / 2080
    description: 'Marketing, Design, Content',
    color: 'pink'
  },
  corporate: {
    type: 'corporate',
    label: 'Corporate',
    defaultEmploymentType: 'fulltime',
    averageSalary: 75000,
    averageRate: 36.06,  // 75000 / 2080
    description: 'General business, Operations',
    color: 'gray'
  },
  startup: {
    type: 'startup',
    label: 'Startup',
    defaultEmploymentType: 'fulltime',
    averageSalary: 65000,
    averageRate: 31.25,  // 65000 / 2080
    description: 'Early stage, bootstrapped',
    color: 'green'
  }
}
```

### Comparison Metrics

```typescript
const generateComparison = (cost: number): string => {
  const comparisons = [
    { item: 'hours of consultant time', unitCost: 175 },
    { item: 'days of contractor pay', unitCost: 600 },
    { item: 'enterprise software licenses per month', unitCost: 75 },
    { item: 'training course seats', unitCost: 750 },
    { item: 'conference registrations', unitCost: 1200 },
    { item: 'laptop replacements', unitCost: 1200 },
    { item: 'project management licenses per month', unitCost: 15 },
    { item: 'weekly team lunch budget', unitCost: 100 }
  ]
  
  const random = comparisons[
    Math.floor(Math.random() * comparisons.length)
  ]
  const quantity = Math.floor(cost / random.unitCost)
  
  return `${quantity} ${random.item}`
}
```

### Recurring Meeting Projection

```typescript
const projectAnnualCost = (
  meetingCost: number,
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
): number => {
  const multipliers = {
    daily: 250,    // Work days
    weekly: 52,
    biweekly: 26,
    monthly: 12
  }
  return meetingCost * multipliers[frequency]
}
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

**Keyboard Navigation:**
- All interactive elements focusable
- Logical tab order
- Escape key closes modals
- Enter/Space activates buttons

**Screen Reader Support:**
- Semantic HTML structure
- ARIA labels for dynamic content
- Live region announcements for cost updates
- Form validation messages

**Visual:**
- Color contrast ratio ≥ 4.5:1 (text)
- Color contrast ratio ≥ 3:1 (UI elements)
- No information conveyed by color alone
- Focus indicators visible
- Text resizable to 200%

**Motion:**
- Prefers-reduced-motion respected
- Optional: Disable ticker animations
- No auto-playing sounds without consent

**Testing:**
- Automated: axe-core via Playwright tests
- Manual: NVDA/JAWS screen reader testing
- Keyboard-only navigation verification

---

## Performance Targets

### Core Web Vitals

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTI (Time to Interactive):** < 3.5s

### Bundle Size Goals

- Initial JS bundle: < 150KB gzipped
- CSS bundle: < 50KB gzipped
- Total page weight: < 500KB

### Optimization Strategies

1. **Code Splitting:**
   - Lazy load analytics page
   - Lazy load receipt generator
   - Lazy load chart libraries

2. **Image Optimization:**
   - WebP with PNG fallback
   - Lazy loading for below-fold images
   - Responsive images via nuxt/image

3. **Caching:**
   - Service worker for offline functionality
   - LocalStorage for meeting history
   - Stale-while-revalidate strategy

4. **SSR Configuration:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,  // Enable SSR
  routeRules: {
    '/': { prerender: true },          // Static landing page
    '/calculate': { ssr: false },      // Client-only calculator
    '/history': { ssr: false },       // Client-only history
    '/about': { prerender: true },     // Static about page
    '/share': { ssr: false }          // Client-only receipt view (data from URL)
  }
})
```

---

## SEO & Social Sharing

### Meta Tags

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'MeetCost - Watch Your Meeting Dollars Burn in Real-Time',
  description: 'A real-time meeting cost calculator that makes meeting waste visible. Track, analyze, and share the true cost of corporate meetings.',
  ogTitle: 'MeetCost - Meeting Cost Calculator',
  ogDescription: 'Stop wasting money on unproductive meetings. See the cost in real-time.',
  ogImage: 'https://meetcost.app/og-image.png',
  ogUrl: 'https://meetcost.app',
  twitterCard: 'summary_large_image',
  twitterTitle: 'MeetCost - Meeting Cost Calculator',
  twitterDescription: 'This meeting just cost $4,980. How much are yours?',
  twitterImage: 'https://meetcost.app/twitter-card.png'
})
</script>
```

### Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "MeetCost",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Real-time meeting cost calculator and analyzer",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

---

## Deployment Configuration

### Netlify Setup

**Deployment Type:** Hybrid Static + Client-Side (no serverless functions for Phases 1-3)

**netlify.toml:**
```toml
[build]
  command = "yarn build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "20"
  YARN_VERSION = "1.22.22"

# Redirect all routes to index.html for client-side routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Cache-Control = "public, max-age=3600, must-revalidate"

# Cache static assets longer
[[headers]]
  for = "/_nuxt/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Why No Serverless Functions:**
- All calculation logic runs client-side (JavaScript)
- Data stored in browser localStorage (no database)
- Share links embed data in URL (no server lookup)
- Receipt generation uses Canvas API (browser-native)
- No authentication or user accounts (Phases 1-3)

**What Nuxt SSR Does:**
- Pre-renders landing/about pages at build time (SSG)
- Generates static HTML for SEO
- Calculator/history pages are client-only (CSR)
- No server runtime needed after build

**Deployment Process:**
```bash
# Option 1: Automatic Git deployment (recommended)
git push origin main
# Netlify auto-detects changes and deploys

# Option 2: Manual CLI deployment
yarn build
netlify deploy --prod

# Option 3: Drag and drop .output/public folder to Netlify UI
```

**Environment Variables:**
```bash
# .env (local development only, not deployed)
NUXT_PUBLIC_SITE_URL=http://localhost:3000

# Netlify Environment Variables (set in UI)
NUXT_PUBLIC_SITE_URL=https://meetcost.app
NUXT_PUBLIC_ANALYTICS_ID=  # Optional: Plausible/Umami
```

**Build Output:**
```
.output/
├── public/              # Static files (this gets deployed)
│   ├── _nuxt/          # JS/CSS bundles
│   ├── index.html      # Pre-rendered landing page
│   ├── about.html      # Pre-rendered about page
│   └── ...
└── server/             # Not used (no serverless functions)
```

**Performance Expectations:**
- **Build time:** 30-60 seconds
- **Deploy time:** 10-20 seconds
- **First load:** < 2 seconds (cached: < 500ms)
- **Bundle size:** ~150KB gzipped (Phase 1-2), ~250KB (Phase 3)

**Cost:**
- **Free Tier:** Unlimited for static sites
- **Bandwidth:** 100GB/month free (more than enough)
- **Builds:** 300 build minutes/month free
- **Expected:** $0/month for Phases 1-3

---

## Sensible Defaults Summary

**Goal:** Minimize friction for first-time users while providing power-user flexibility

### Application-Wide Defaults

```typescript
const APP_DEFAULTS = {
  // Meeting Setup
  numberOfPeople: 5,           // Average meeting size
  employmentType: 'fulltime',  // Most common in government/corporate
  duration: 60,                // 1 hour (in minutes)
  
  // Government Preset (default)
  annualSalary: 65000,         // State employee average
  hourlyRate: 31.25,           // 65000 / 2080
  
  // UI Settings
  buttonHeight: 52,            // Touch-friendly (Apple HIG: 44px minimum)
  inputFontSize: 16,           // Prevents mobile zoom
  baseFontSize: 16,            // WCAG readable
  
  // Color Thresholds
  costThresholds: {
    low: 500,      // Green: $0-500
    medium: 2000,  // Yellow: $501-2000
    high: 2001     // Red: $2001+
  },
  
  // Milestone Alerts
  milestones: [500, 1000, 5000, 10000],
  
  // Export Settings
  imageResolution: 2,          // Retina displays
  imageWidth: 800,
  imageHeight: 1000,
  csvIncludeParticipants: false,
  
  // Display Options
  showComparisons: true,
  showDuration: true,
  showBreakdown: true,
  enableSounds: false,         // Off by default (accessibility)
  
  // History
  historyRetentionDays: 90,    // LocalStorage cleanup
  maxHistoryEntries: 100
}
```

### Form Pre-fill Logic

**New User (No History):**
1. Employment Type: Full-Time (selected)
2. Number of People: 5
3. Annual Salary: $65,000
4. Duration: 60 minutes

**Returning User:**
1. Use last meeting's configuration
2. Offer "Use Last Setup" quick button
3. Show recent preset in dropdown

### Preset Selection Defaults

Each preset comes with employment type default:
- **Tech/Software:** Full-Time, $95,000/year
- **Consulting:** Contractor, $125/hour
- **Government:** Full-Time, $65,000/year (matches overall default)
- **Agency/Creative:** Full-Time, $85,000/year
- **Corporate:** Full-Time, $75,000/year
- **Startup:** Full-Time, $65,000/year

### Progressive Disclosure

**Basic Mode (Default):**
- Quick setup with pre-filled values
- Employment type selector
- Single compensation input
- Start button

**Advanced Mode (Optional):**
- Individual participant management
- Role labels
- Custom rates per person
- Meeting notes field
- Save as template

---

## Security Considerations

### Content Security Policy

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'", 'data:'],
        'connect-src': ["'self'"]
      }
    }
  }
})
```

### Data Privacy

- **No PII collection:** No names, emails, or identifiers
- **LocalStorage only:** All meeting data stays client-side; no server-side persistence
- **Share links:** Use client-side URL encoding (e.g. `?r=<base64-receipt-data>`). Receipt data is embedded in the link; no server storage or lookup required
- **No tracking cookies:** Analytics optional and privacy-first
- **No third-party scripts:** Self-hosted assets only
- **GDPR compliant:** No user data leaves their device

### LocalStorage Management

**Size Limits & Monitoring:**
- LocalStorage typical limit: 5-10MB per domain
- Target maximum usage: 4MB (safety margin)
- Automatic monitoring on each write operation
- User notification at 3.5MB (87.5% of target)

**Cleanup Strategy:**
```typescript
// composables/useStorageManagement.ts
const STORAGE_LIMIT = 4 * 1024 * 1024  // 4MB target
const STORAGE_WARNING_THRESHOLD = 3.5 * 1024 * 1024  // 3.5MB warning

const getStorageSize = (): number => {
  let total = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return total * 2 // UTF-16 encoding (2 bytes per char)
}

const cleanupOldestMeetings = (targetSize: number = STORAGE_LIMIT * 0.75) => {
  const meetings = getMeetingsFromStorage()
  const sorted = meetings.sort((a, b) => a.timestamp - b.timestamp)
  
  while (getStorageSize() > targetSize && sorted.length > 0) {
    const oldest = sorted.shift()
    deleteMeeting(oldest.id)
  }
}

const checkStorageBeforeWrite = (): boolean => {
  const currentSize = getStorageSize()
  
  if (currentSize > STORAGE_WARNING_THRESHOLD) {
    // Warn user
    showStorageWarning()
  }
  
  if (currentSize > STORAGE_LIMIT) {
    // Auto-cleanup
    cleanupOldestMeetings()
    return true
  }
  
  return false
}
```

**Retention Policy:**
- Default: 90 days
- Maximum entries: 100 meetings
- Automatic cleanup when limits approached
- User can manually export all data before cleanup

**Error Handling:**
- Graceful fallback if localStorage unavailable
- User notification if write fails
- Option to download current meeting as file if storage full

---

## Error Handling & Edge Cases

### Error Handling Strategy

**1. Calculation Errors**
```typescript
// utils/calculations.ts
const calculateMeetingCost = (
  participants: Participant[],
  durationSeconds: number
): { cost: number; error?: string } => {
  try {
    // Validate inputs
    if (!participants || participants.length === 0) {
      return { cost: 0, error: 'No participants provided' }
    }
    
    if (durationSeconds < 0) {
      return { cost: 0, error: 'Invalid duration' }
    }
    
    const activeParticipants = participants.filter(p => p.isActive)
    
    if (activeParticipants.length === 0) {
      return { cost: 0, error: 'No active participants' }
    }
    
    const totalHourlyRate = activeParticipants.reduce(
      (sum, p) => sum + (p.effectiveHourlyRate || 0), 
      0
    )
    
    if (totalHourlyRate === 0) {
      return { cost: 0, error: 'Invalid hourly rates' }
    }
    
    const costPerSecond = totalHourlyRate / 3600
    return { cost: costPerSecond * durationSeconds }
  } catch (error) {
    console.error('Calculation error:', error)
    return { cost: 0, error: 'Calculation failed' }
  }
}
```

**2. LocalStorage Errors**
```typescript
const saveMeeting = (meeting: Meeting): boolean => {
  try {
    // Check storage before write
    checkStorageBeforeWrite()
    
    const data = JSON.stringify(meeting)
    localStorage.setItem(`meeting_${meeting.id}`, data)
    return true
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // Storage full - cleanup and retry
      cleanupOldestMeetings()
      try {
        localStorage.setItem(`meeting_${meeting.id}`, JSON.stringify(meeting))
        return true
      } catch (retryError) {
        showError('Storage full. Please export your data and clear old meetings.')
        return false
      }
    } else {
      showError('Failed to save meeting. Data may not be persisted.')
      return false
    }
  }
}
```

**3. Canvas/Image Generation Errors**
```typescript
const generateReceiptImage = async (meeting: Meeting): Promise<Blob | null> => {
  try {
    // Check Canvas support
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('Canvas not supported')
    }
    
    // Generate image
    return await createReceiptCanvas(meeting)
  } catch (error) {
    console.error('Image generation failed:', error)
    
    // Fallback: Download as text instead
    showNotification('Image generation unavailable. Downloading as text.')
    const textContent = generatePlainText(meeting)
    downloadFile(textContent, `receipt-${meeting.id}.txt`, 'text/plain')
    
    return null
  }
}
```

**4. Clipboard API Errors**
```typescript
const copyToClipboard = async (content: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(content)
      showNotification('Copied to clipboard!')
      return true
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = content
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      
      if (success) {
        showNotification('Copied to clipboard!')
        return true
      } else {
        throw new Error('Copy failed')
      }
    }
  } catch (error) {
    showError('Failed to copy. Please select and copy manually.')
    return false
  }
}
```

**5. Share API Errors**
```typescript
const shareReceipt = async (meeting: Meeting): Promise<boolean> => {
  try {
    // Try native share API first
    if (navigator.share) {
      await navigator.share({
        title: `Meeting Cost: ${formatCurrency(meeting.totalCost)}`,
        text: generatePlainText(meeting),
        url: window.location.origin + `/share?r=${encodeReceiptData(meeting)}`
      })
      return true
    } else {
      // Fallback: Copy link to clipboard
      const shareUrl = window.location.origin + `/share?r=${encodeReceiptData(meeting)}`
      await copyToClipboard(shareUrl)
      showNotification('Share link copied to clipboard!')
      return true
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      // User cancelled - not an error
      return false
    }
    
    console.error('Share failed:', error)
    showError('Sharing unavailable. Try copying the link instead.')
    return false
  }
}
```

**6. Form Validation Errors**
```typescript
const validateParticipant = (participant: Partial<Participant>): string[] => {
  const errors: string[] = []
  
  if (participant.employmentType === 'fulltime') {
    if (!participant.annualSalary || participant.annualSalary < 20000) {
      errors.push('Annual salary must be at least $20,000')
    }
    if (participant.annualSalary && participant.annualSalary > 500000) {
      errors.push('Annual salary seems unusually high (>$500,000)')
    }
  } else {
    if (!participant.hourlyRate || participant.hourlyRate < 10) {
      errors.push('Hourly rate must be at least $10')
    }
    if (participant.hourlyRate && participant.hourlyRate > 500) {
      errors.push('Hourly rate seems unusually high (>$500)')
    }
  }
  
  return errors
}
```

**7. Network/Offline Handling**
```typescript
// For future phases with network features
const handleOffline = () => {
  window.addEventListener('online', () => {
    showNotification('Connection restored')
  })
  
  window.addEventListener('offline', () => {
    showNotification('You are offline. App will work in offline mode.', 'info')
  })
}
```

**Error Notification System:**
```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info'

const showNotification = (message: string, type: NotificationType = 'success') => {
  // Use Nuxt UI's toast/notification system
  // Duration: 3s for success/info, 5s for warning/error
}

const showError = (message: string, details?: string) => {
  showNotification(message, 'error')
  if (details) {
    console.error(details)
  }
}
```

---

## Testing Strategy

### Unit Tests (Vitest)

```typescript
// tests/unit/calculations.test.ts
describe('Meeting Cost Calculator', () => {
  it('calculates cost correctly', () => {
    const result = calculateMeetingCost(
      [{ id: '1', employmentType: 'contractor', effectiveHourlyRate: 100, isActive: true }],
      3600 // 1 hour
    )
    expect(result).toBe(100)
  })
  
  it('handles multiple participants', () => {
    const participants = [
      { id: '1', employmentType: 'contractor', effectiveHourlyRate: 100, isActive: true },
      { id: '2', employmentType: 'contractor', effectiveHourlyRate: 80, isActive: true }
    ]
    const result = calculateMeetingCost(participants, 3600)
    expect(result).toBe(180)
  })
  
  it('excludes inactive participants from cost', () => {
    const participants = [
      { id: '1', employmentType: 'contractor', effectiveHourlyRate: 100, isActive: true },
      { id: '2', employmentType: 'contractor', effectiveHourlyRate: 80, isActive: false }
    ]
    const result = calculateMeetingCost(participants, 3600)
    expect(result).toBe(100) // Only active participant counted
  })
})
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/calculator.spec.ts
test('complete meeting flow', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start Tracking Now')
  
  // Setup meeting
  await page.fill('[data-test="participant-count"]', '5')
  await page.fill('[data-test="hourly-rate"]', '75')
  await page.click('text=Start Meeting')
  
  // Verify calculator page
  await expect(page.locator('[data-test="cost-display"]')).toBeVisible()
  
  // Wait and verify cost increases
  await page.waitForTimeout(2000)
  const cost = await page.locator('[data-test="cost-display"]').textContent()
  expect(parseFloat(cost || '0')).toBeGreaterThan(0)
  
  // Stop meeting
  await page.click('text=Stop Meeting')
  
  // Verify receipt
  await expect(page.locator('[data-test="receipt"]')).toBeVisible()
})
```

### Accessibility Tests

```typescript
// tests/a11y/calculator.spec.ts
test('calculator is accessible', async ({ page }) => {
  await page.goto('/calculate')
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
    
  expect(results.violations).toEqual([])
})
```

---

## Analytics & Monitoring

### Privacy-First Analytics (Plausible/Umami)

**Events to Track:**
- Page views: /, /calculate, /history
- Meeting started
- Meeting completed (with duration bucket: <15min, 15-30min, 30-60min, >60min)
- Receipt generated
- Receipt shared (platform: Twitter, LinkedIn, Slack, Download)
- Preset selected (type)
- Meeting saved to history

**No Tracking:**
- Individual meeting costs (privacy)
- Specific hourly rates
- Participant details
- User identifiers

### Error Monitoring (Optional: Sentry)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      sentry: {
        dsn: process.env.SENTRY_DSN
      }
    }
  }
})
```

---

## Future Considerations

### Phase 5: Enterprise Features (Not MVP)

- **Organization Accounts:**
  - Multi-user dashboards
  - Team-wide analytics
  - Shared meeting templates
  - Role-based permissions

- **Advanced Analytics:**
  - Meeting efficiency scores
  - Department cost comparisons
  - ROI calculator (savings from reduced meetings)
  - Benchmark against industry averages

- **Integrations:**
  - Slack app (slash commands)
  - Microsoft Teams integration
  - Zapier webhooks
  - CSV import/export for HR systems

### Monetization Options (If Applicable)

1. **Free Tier:**
   - Unlimited calculations
   - 30-day history
   - Basic receipt sharing

2. **Premium ($5/month):**
   - Unlimited history
   - Calendar integration
   - Advanced analytics
   - Custom branding on receipts
   - Export to CSV/PDF

3. **Enterprise ($50/month per org):**
   - Team dashboards
   - API access
   - SSO integration
   - White-label options

---

## Project Setup Instructions

### Initial Scaffold

```bash
# Create new Nuxt 4 project
npx nuxi@latest init burnrate -t ui

cd burnrate

# Set Yarn 1.22.22 as package manager
yarn set version 1.22.22

# Install Nuxt UI and dependencies
yarn add @nuxt/ui @vueuse/core

# Install dev dependencies
yarn add -D @nuxtjs/tailwindcss @nuxt/icon @nuxtjs/color-mode

# Optional: Testing
yarn add -D vitest @nuxt/test-utils playwright @axe-core/playwright

# Create directory structure
mkdir -p app/{components/{calculator,analytics,shared},composables,types,utils,layouts}
mkdir -p public/icons

# Initialize Git
git init
git add .
git commit -m "Initial commit: MeetCost project scaffold"
```

### nuxt.config.ts (Initial)

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  
  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxtjs/color-mode'
  ],

  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: true
  },

  ssr: true,

  routeRules: {
    '/': { prerender: true },
    '/calculate': { ssr: false },
    '/history': { ssr: false },
    '/about': { prerender: true }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'MeetCost - Meeting Cost Calculator',
      meta: [
        { name: 'description', content: 'Watch your meeting dollars burn in real-time' }
      ]
    }
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  }
})
```

### package.json Scripts

```json
{
  "name": "burnrate",
  "version": "1.0.0",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint .",
    "typecheck": "nuxt typecheck"
  }
}
```

---

## Development Milestones

### Week 1: Foundation (Phase 1)
- [x] Project scaffold complete
- [ ] Landing page with hero and CTA
- [ ] Calculator setup form (Quick Mode)
- [ ] LiveCounter component
- [ ] Basic receipt generation (text)
- [ ] Responsive layout (mobile-first)
- [ ] **Deploy to Netlify** - Working app after Phase 1

### Week 2: Polish & Viral Features (Phase 2)
- [ ] Visual receipt with Canvas API
- [ ] Social sharing integration
- [ ] Industry presets
- [ ] Milestone alerts
- [ ] Meeting history (last 10)
- [ ] Dark mode implementation
- [ ] **Deploy to Netlify** - Enhanced app after Phase 2

### Week 3-4: Analytics & Intelligence (Phase 3)
- [ ] Cost trend charts
- [ ] Full meeting history with filtering
- [ ] Export functionality (CSV/JSON)
- [ ] Recurring meeting calculator
- [ ] Storage management (4MB limit)
- [ ] Performance optimization
- [ ] **Deploy to Netlify** - Complete app after Phase 3

### Week 5+: Advanced Features (Phase 4 - Optional)
- [ ] Calendar integration
- [ ] Browser extension
- [ ] Advanced analytics
- [ ] Optional: Team features (would require serverless)
- [ ] **Deploy to Netlify** - May add serverless functions

**Note:** Each phase ends with a fully functional, deployable application. No half-finished states.

---

## Success Metrics (Post-Launch)

### Week 1 Goals:
- 100 unique visitors
- 50 calculations completed
- 10 receipts shared

### Month 1 Goals:
- 1,000 unique visitors
- 500 calculations completed
- 100 receipts shared
- 20% return visitor rate

### Month 3 Goals:
- 5,000 unique visitors
- 50% organic traffic (SEO)
- Featured in productivity newsletter/blog
- 1,000+ receipts shared

---

## Conclusion

MeetCost is positioned as a viral-ready tool that solves a real pain point (meeting waste) with immediate visual impact (real-time cost ticker) and social proof mechanisms (shareable receipts). The tech stack leverages modern, performant frameworks (Nuxt 4 + Nuxt UI v4) while maintaining accessibility and privacy-first principles.

**Deployment Strategy:**
- **Phases 1-3:** Fully static deployment (no serverless, zero cost)
- **Phase 4:** Optional serverless for advanced features only
- **Architecture:** Hybrid SSG/CSR - best of both worlds
- **Hosting:** Netlify free tier (more than sufficient)

**Key Technical Decisions:**
1. **Client-side first:** All logic in browser = zero server costs
2. **LocalStorage:** No database needed = simpler architecture
3. **URL-based sharing:** No backend API = privacy-first
4. **Static generation:** SEO benefits without server runtime
5. **Progressive enhancement:** Works even with JS disabled (landing page)

**Next Steps:**
1. ✅ Review and approve this design document
2. ✅ All critical issues resolved
3. **Start Phase 1:** Initialize project scaffold
4. **Deploy early:** Push to Netlify after each phase
5. **Iterate fast:** Static deployment = instant updates

**Estimated Timeline:** 
- Phase 1: Weekend (12-16 hours) → **Working app deployed**
- Phase 2: 1 week (20-24 hours) → **Shareable app deployed**
- Phase 3: 1-2 weeks (28-32 hours) → **Complete app deployed**
- Phase 4: Future (optional advanced features)

**Total Time to Production MVP:** 3-4 weeks with full features (Phases 1-3)

---

**Document Version:** 1.0.1  
**Last Updated:** February 7, 2026  
**Author:** Chris Schweda  
**Status:** ✅ **APPROVED - PRODUCTION READY**
