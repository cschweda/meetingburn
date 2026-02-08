# MeetingBurn

**See the real cost of every meeting.**

🔗 **[meetingburn.app](https://meetingburn.app)**

MeetingBurn is a real-time meeting cost calculator that makes meeting waste visible. Track the true cost of meetings with a live-ticking counter, shareable receipts, and support for both private-sector and taxpayer-funded (public-sector) contexts.

![MeetingBurn](public/og-image.png)

## Screenshots

| | |
|:-------------------------:|:-------------------------:|
| ![Screenshot 1](public/Screenshot1.jpg) | ![Screenshot 2](public/screenshot2.jpg) |
| ![Screenshot 3](public/screenshot3.jpg) | ![Screenshot 4](public/screenshot4.jpg) |

## Features

- **Live cost counter** — Watch dollars tick up every second during meetings
- **Color-coded thresholds** — Green ($0–500), yellow ($501–2,000), red ($2,001+)
- **Milestone alerts** — Toast notifications at $500, $1K, $5K, and $10K
- **Remote vs. in-person** — Choose meeting format; in-person meetings add optional "in-person tax" (commute time value + extras like coffee, parking) typically paid by employees
- **Industry presets** — One-tap setup for Tech, Government, Consulting, Agency, Corporate, and 20+ industries
- **Setup flow** — Configure participants (full-time salary, contractor hourly, or unknown/estimate); meeting type; and sector (public/private)
- **Meeting timer** — Shows participant count, meeting type, and average hourly rate with an info popup
- **Pause & resume** — Pause tracking when meetings go off-topic
- **Shareable receipts** — Download as Markdown, TXT, CSV, PDF, or PNG; copy to clipboard
- **Share link** — Generate URL-encoded receipt links (`/share?r=...`) for sharing
- **Native share API** — One-tap share to social apps on supported devices (with copy-link fallback)
- **Meeting score** — Optional 0–100 efficiency score displayed as a Lighthouse-style gauge. Evaluates format (remote vs. in-person), participant count, duration, meeting type, and in-person costs. Research-backed with citations. Toggled by the user; never shown in shared receipts, downloads, or clipboard copies
- **Duration adjustment** — Forgot to stop? Adjust duration (hours, minutes, seconds) on the receipt; cost and score update in real time and auto-save when focus leaves the adjustment field
- **Meeting history** — Meetings saved in local storage (up to 100); adjust duration and view past receipts
- **Public vs. private sector** — Tag meetings as taxpayer-funded (public) or company dollars (private)
- **Meeting types** — Quick-select from General, Stand Up, Touch Base, Sprint Planning, and more
- **Privacy-first** — All computation runs in your browser; no data is sent to any server

## How it works

1. **Setup** — Pick an industry preset or enter participants manually (full-time, contractor, or unknown/estimate). Choose meeting type and sector.
2. **Track** — Start the meeting; the cost counter updates every second.
3. **Share** — Stop to generate a receipt. Export or copy to share with your team.

### Calculation method

- **Full-time salary:** Hourly rate = annual salary ÷ 2,080 (40 hrs/week × 52 weeks)
- **Contractor / unknown:** Hourly rate = the rate you enter
- **Meeting cost:** (Sum of all hourly rates) × (duration in seconds) ÷ 3,600
- **In-person tax (optional):** Commute time value + extras per person (coffee, parking, etc.). Itemized by company vs. employee on the receipt.

### Meeting score algorithm

The optional meeting score (0–100) starts at 100 and applies penalties/bonuses based on:

- **Format appropriateness** — In-person meetings are penalized for async-friendly types (standups, status updates); remote is preferred for routine work
- **Participant count** — Medium (8–14: -5), large (25+: -8), very large (50+: -8), and large in-person gatherings (50+: additional -10)
- **Duration** — Long durations for status-type meetings are penalized; short standups get a small bonus
- **In-person costs** — High cost per attendee-hour is penalized for in-person meetings only (reflects actual expenses beyond salary). Remote meetings are NOT penalized for high hourly rates—that's just the cost of time
- **Total cost** — Very high total costs (>$8K, >$15K) are penalized regardless of format

The scoring algorithm is explained in detail on the [About page](https://meetingburn.app/about#scoring-algorithm), including research citations from Stanford WFH Research, Harvard Business Review, Pew Research, and peer-reviewed journals.

## Tech stack

- **Framework:** Nuxt 4, Vue 3
- **UI:** Nuxt UI v4, Tailwind CSS v4
- **Language:** TypeScript
- **Other:** @vueuse/core, jsPDF 4.x (PDF export), Vitest (tests)

## Requirements

- Node.js 22.x (see `.nvmrc` for exact version)
- Yarn or npm

## Development

```bash
# Install dependencies
yarn install

# Start dev server (http://localhost:3000)
yarn dev

# Build for production (static)
yarn generate

# Preview production build
yarn preview

# Run tests
yarn test
```

### Testing

MeetingBurn is thoroughly tested with **107 tests** across 9 suites. Run with `yarn test`. Tests live in `tests/` at the project root, mirroring the `app/` structure.

| Suite | Tests | Coverage |
|-------|-------|----------|
| **calculations** | 22 | Hourly rates, cost-per-second, meeting cost, in-person cost, edge cases |
| **formatting** | 15 | Currency, duration, dates, times, elapsed time |
| **useShareReceipt** | 22 | Privacy, PII protection, share URL generation, PII exclusion |
| **useMeetingScore** | 11 | Scoring algorithm, format penalties, participant thresholds, grade mapping |
| **useCalculator** | 8 | Meeting building, remote/in-person, quick-mode participants |
| **sanitize** | 11 | Input sanitization, XSS prevention |
| **comparisons** | 8 | Cost-to-item comparisons |
| **score-duration-adjustment** | 6 | Score updates with duration changes, remote vs. in-person cost logic |
| **user-scenario** | 4 | End-to-end scoring verification for real-world meeting scenarios |

#### calculations (22 tests)

Core cost math: salary-to-hourly conversion, cost-per-second, meeting cost, and in-person costs (commute + extras). Covers `calculateEffectiveHourlyRate`, `getCostPerSecond`, `getAverageHourlyRate`, `calculateMeetingCost`, and `calculateInPersonCost`. Verifies full-time (salary ÷ 2080) and contractor rates, ignores inactive participants, handles empty/negative inputs, and checks the default 5-person scenario (~6.5¢/second).

#### formatting (15 tests)

Display helpers: `formatCurrency` (USD, 2 decimals), `formatHourlyRate`, `formatDuration` (seconds/minutes/hours, singular/plural), `formatElapsedTime` (M:SS and H:MM:SS), `formatDate`, `formatTime`, `formatDateISO`, and `formatTime24`.

#### useShareReceipt (22 tests) — Sharing & security

Share-link privacy and PII protection:

- **PII exclusion** — Excludes individual salaries, hourly rates, participant IDs, names, roles, meeting IDs, and email-like identifiers. Payload has only whitelisted keys (`t`, `d`, `n`, `c`, `a`, `s`, `m`, `f`, `ct`, `un`, `fm`, `ip`). No individual `effectiveHourlyRate` values; only aggregated counts and averages. Meeting scores are never included in share payloads.
- **Round-trip integrity** — Encode/decode preserves only safe, aggregated data. Invalid, corrupted, empty, or malformed base64 payloads return `null`.
- **URL generation** — Share URLs use base64-safe characters and contain no raw sensitive data. Same meeting yields consistent URLs.
- **Privacy guarantees** — Full encode/decode cycle leaks no PII. Payload has no `participants` array. URL parameter uses only base64-safe characters.

These tests ensure share links never expose salary, compensation, or identifying information.

#### useCalculator (8 tests)

Meeting construction: `buildMeeting` returns correct structure, computes `totalCost` from participants and duration, sanitizes meeting descriptions (XSS prevention), and handles remote vs in-person (with/without in-person tax). `createParticipantsFromQuickMode` builds full-time (from salary) and contractor (from hourly rate) participants.

#### sanitize (11 tests)

Input sanitization for safe display and export: strips HTML tags, angle brackets, `javascript:` and `data:` protocols, control characters, and zero-width characters. Rejects non-string input, trims whitespace, enforces `maxLength`, and passes through safe strings.

#### comparisons (8 tests)

Cost-to-item utilities: `generateComparison` returns "0 items" for zero/negative cost and "N item" strings for positive cost. `generateComparisonList` returns up to N items, no duplicates, correct format, and positive quantities.

#### useMeetingScore (11 tests)

Meeting score algorithm: score bounds (0–100 clamping for normal and extreme inputs), grade mapping (A+ through F), format appropriateness (in-person + async-friendly penalized more than remote, remote + async-friendly gets bonus), medium-sized meeting penalty (8–14 people: -5), boundary cases (7/8/14/15 participants), and the Example 7 regression test (75-person 8hr in-person all-hands scores below 55).

#### score-duration-adjustment (6 tests) — Integration

Verifies that meeting scores update correctly when duration is adjusted. Tests duration changes (35 min → 2 hours), long async meeting penalties, hours/minutes/seconds calculation, the user's exact 11-person scenario, multi-hour durations, and that cost-per-person-hour penalties only apply to in-person meetings (not remote).

#### user-scenario (4 tests) — Verification

End-to-end verification of real-world scoring scenarios: 11-person remote General meeting scores 95 (not 100), duration adjustments preserve correct score, hours input calculates correctly, and score factors remain consistent across duration changes.

#### Safe to use

The app is **privacy-first** and **client-only**: your salary data, participant details, and meeting history never leave your device. The test suite verifies that sharing receipts and export flows do not leak PII.

### Using nvm

```bash
nvm use
yarn install
yarn dev
```

## Project structure

```
app/
├── components/
│   ├── calculator/          # LiveCounter, SetupForm, Receipt, PresetPicker
│   └── MeetingScoreGauge.vue  # Lighthouse-style circular score gauge (SVG)
├── composables/             # useCalculator, useReceipt, useShareReceipt, usePresets,
│                            #   useMeetingBurnConfig, useMeetingHistory, useMeetingScore
├── layouts/                 # default, calculator
├── pages/                   # index, calculate, about, history, share
├── types/                   # Meeting, Participant, SectorType, Preset, etc.
├── utils/                   # formatting, calculations, comparisons, sanitize
└── app.vue

tests/                       # Vitest tests (107 tests across 9 suites)
├── composables/             # useCalculator, useShareReceipt, useMeetingScore
├── integration/             # Score + duration adjustment integration tests
├── verification/            # End-to-end user scenario verification
└── utils/                   # calculations, formatting, sanitize, comparisons

documentation/               # Design docs, assessments, implementation notes
public/                      # Static assets (favicon, screenshots)
meetingburn.config.ts        # Single source of truth for app config
```

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Build command: `yarn generate`
3. Publish directory: `.output/public`

See `netlify.toml` for configuration. Node version matches `.nvmrc` (22.x).

### Security (Netlify)

The `netlify.toml` applies security headers to all responses:

| Header | Purpose |
|--------|---------|
| `X-Frame-Options: DENY` | Prevents clickjacking |
| `X-Content-Type-Options: nosniff` | Prevents MIME sniffing |
| `Referrer-Policy` | Limits referrer leakage; `no-referrer` for `/share` so the `r=` param is never sent as referrer |
| `Strict-Transport-Security` | Enforces HTTPS (1 year, preload) |
| `Permissions-Policy` | Disables camera, mic, geolocation, etc. |
| `Content-Security-Policy` | Restricts script/style/img sources; `'unsafe-inline'` required for Nuxt/Vue hydration |

`X-XSS-Protection` is intentionally omitted (deprecated; CSP is the primary XSS defense). The share page (`/share`) uses `Referrer-Policy: no-referrer` so share links never leak the receipt payload in referrer headers.

### Other platforms

The app is a static Nuxt build. Deploy the contents of `.output/public` to any static host (Vercel, Cloudflare Pages, etc.). Ensure the Node version matches `.nvmrc` for the build step.

## Configuration

App-wide settings live in `meetingburn.config.ts`:

- Site URL, app name, tagline
- Sector labels (public/private)
- Meeting type options
- Receipt footer text

## License

MIT — see [LICENSE](LICENSE) for details.
