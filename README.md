# MeetCost

**See the real cost of every meeting.**

MeetCost is a real-time meeting cost calculator that makes meeting waste visible. Track the true cost of meetings with a live-ticking counter, shareable receipts, and support for both private-sector and taxpayer-funded (public-sector) contexts.

## Screenshots

| | |
|:-------------------------:|:-------------------------:|
| ![Screenshot 1](public/Screenshot1.jpg) | ![Screenshot 2](public/screenshot2.jpg) |
| ![Screenshot 3](public/screenshot3.jpg) | ![Screenshot 4](public/screenshot4.jpg) |

## Features

- **Live cost counter** — Watch dollars tick up every second during meetings
- **Setup flow** — Configure participants (full-time salary or contractor hourly rate), meeting type, and sector (public/private)
- **Meeting timer** — Shows participant count, meeting type, and average hourly rate with an info popup
- **Pause & resume** — Pause tracking when meetings go off-topic
- **Shareable receipts** — Download as Markdown, TXT, CSV, or PDF; copy to clipboard
- **Duration adjustment** — Forgot to stop? Adjust duration on the receipt; cost updates in real time and auto-saves when focus leaves the adjustment field
- **Meeting history** — Meetings saved in local storage; adjust duration and view past receipts
- **Public vs. private sector** — Tag meetings as taxpayer-funded (public) or company dollars (private)
- **Meeting types** — Quick-select from General, Stand Up, Touch Base, 1:1, Sprint Planning, and more
- **Privacy-first** — All computation runs in your browser; no data is sent to any server

## How it works

1. **Setup** — Enter number of participants, their employment type (full-time or contractor), and compensation. Choose meeting type and sector.
2. **Track** — Start the meeting; the cost counter updates every second.
3. **Share** — Stop to generate a receipt. Export or copy to share with your team.

### Calculation method

- **Full-time salary:** Hourly rate = annual salary ÷ 2,080 (40 hrs/week × 52 weeks)
- **Contractor:** Hourly rate = the rate you enter
- **Total cost:** (Sum of all hourly rates) × (duration in seconds) ÷ 3,600

See the [About](/about) page for a detailed explanation and examples.

## Tech stack

- **Framework:** Nuxt 4, Vue 3
- **UI:** Nuxt UI v4, Tailwind CSS v4
- **Language:** TypeScript
- **Other:** @vueuse/core, jsPDF (for PDF export), Vitest (tests)

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

### Using nvm

```bash
nvm use
yarn install
yarn dev
```

## Project structure

```
app/
├── components/calculator/   # LiveCounter, SetupForm, Receipt
├── composables/             # useCalculator, useReceipt, useMeetcostConfig, useMeetingHistory
├── layouts/                 # default, calculator
├── pages/                   # index, calculate, about, history
├── types/                   # Meeting, Participant, SectorType, etc.
├── utils/                   # formatting, calculations, comparisons (+ tests)
└── app.vue

public/                      # Static assets (favicon, screenshots)
meetcost.config.ts           # Single source of truth for app config
```

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Build command: `yarn generate`
3. Publish directory: `.output/public`

See `netlify.toml` for configuration. Node version matches `.nvmrc` (22.x).

### Other platforms

The app is a static Nuxt build. Deploy the contents of `.output/public` to any static host (Vercel, Cloudflare Pages, etc.). Ensure the Node version matches `.nvmrc` for the build step.

## Configuration

App-wide settings live in `meetcost.config.ts`:

- Site URL, app name, tagline
- Sector labels (public/private)
- Meeting type options
- Receipt footer text

## License

MIT — see [LICENSE](LICENSE) for details.
