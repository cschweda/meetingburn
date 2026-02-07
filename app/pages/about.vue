<script setup lang="ts">
const { appName, aboutDescription } = useMeetcostConfig()
useSeoMeta({
  title: `About ${appName}`,
  description: aboutDescription,
})
</script>

<template>
  <div class="container mx-auto px-4 py-16 max-w-2xl">
    <h1 class="text-3xl font-bold text-highlighted mb-6">
      About {{ appName }}
    </h1>
    <div class="prose prose-neutral dark:prose-invert max-w-none">
      <p class="text-muted leading-relaxed mb-4">
        {{ appName }} makes invisible meeting waste visible. A live-ticking counter shows dollar-per-second burn rates and creates shareable receipts that drive behavior change in corporate meeting culture.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        <strong>Core value:</strong> Transform abstract meeting time into concrete financial data with shareability.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        All data stays in your browser. No tracking, no servers, no accounts. Privacy-first by design.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        <strong>History & storage:</strong> Meeting history is stored in your browser's local storage—local to your device and to your browser. You can clear it at any time. No data leaves your browser. Ever.
      </p>

      <h2 class="text-xl font-semibold text-highlighted mt-10 mb-3">
        How meeting cost is calculated
      </h2>
      <p class="text-muted leading-relaxed mb-4">
        MeetCost converts each participant's compensation into an hourly rate, sums those rates, and multiplies by meeting duration. All math runs in your browser—no data is sent anywhere.
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        Hourly rate per participant
      </h3>
      <ul class="text-muted leading-relaxed mb-4 list-disc list-inside space-y-1">
        <li><strong>Full-time (salary):</strong> Annual salary ÷ 2,080 hours/year. 2,080 is the standard working hours (40 hrs/week × 52 weeks).</li>
        <li><strong>Contractor (hourly):</strong> The hourly rate you enter is used.</li>
      </ul>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        Average rate
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        The average rate is the sum of all participants' hourly rates divided by the number of participants. It represents the blended hourly cost of the meeting.
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        Total meeting cost
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        Total cost = (sum of all hourly rates) × (duration in seconds) ÷ 3,600. The cost per second is the sum of hourly rates ÷ 3,600; multiply by elapsed seconds to get the total.
      </p>

      <p class="text-muted leading-relaxed mb-6">
        <strong>Examples:</strong>
      </p>
      <p class="text-muted leading-relaxed text-sm mb-6 italic">
        All salary and hourly rates in these examples are best guesses. Actual costs may be higher depending on your organization's compensation.
      </p>

      <div class="space-y-8">
        <!-- Example 1 -->
        <div class="rounded-xl border border-default bg-muted/10 p-6 border-l-4 border-l-primary">
          <div class="flex items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-primary/15 text-primary">
              <UIcon name="i-lucide-users-2" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 1: The 30‑minute sync</h4>
              <p class="text-muted text-sm mb-4">
                3 people at $90K/year → 3 × ($90,000 ÷ 2,080) = $129.81/hr. Thirty minutes: $129.81 × 0.5 = <strong class="text-highlighted">$64.90</strong>.
              </p>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Or that could buy…</p>
                <ul class="text-muted space-y-1 text-sm">
                  <li><span class="text-highlighted">Serious:</span> A month of school lunches for a child, or a full tank of gas for a family road trip.</li>
                  <li><span class="text-highlighted">Less serious:</span> 5 Chipotle burritos, or 12 Starbucks lattes, or 4 months of Netflix.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 2 -->
        <div class="rounded-xl border border-default bg-muted/10 p-6 border-l-4 border-l-amber-500">
          <div class="flex items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <UIcon name="i-lucide-repeat" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 2: The recurring meeting drain</h4>
              <p class="text-muted text-sm mb-4">
                6-person team (avg $100K/year), 1-hour weekly sync. Per meeting: 6 × ($100,000 ÷ 2,080) × 1 = <strong class="text-highlighted">$288</strong>. Over 52 weeks: <strong class="text-highlighted">~$15,000/year</strong>.
              </p>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Or that could buy…</p>
                <ul class="text-muted space-y-1 text-sm">
                  <li><span class="text-highlighted">Serious:</span> Per meeting: 2 weeks of groceries for a family. Per year: a used car down payment, or a year of community college tuition.</li>
                  <li><span class="text-highlighted">Less serious:</span> Per meeting: 24 burritos. Per year: 1,250 lattes—enough to caffeinate the whole team for months.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 3 -->
        <div class="rounded-xl border border-default bg-muted/10 p-6 border-l-4 border-l-blue-500">
          <div class="flex items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <UIcon name="i-lucide-users" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 3: Unit meeting with 15 attendees</h4>
              <p class="text-muted text-sm mb-4">
                15 people (avg $95K/year), 1-hour unit meeting. 15 × ($95,000 ÷ 2,080) × 1 = <strong class="text-highlighted">$685</strong>.
              </p>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Or that could buy…</p>
                <ul class="text-muted space-y-1 text-sm">
                  <li><span class="text-highlighted">Serious:</span> A week of groceries for a family of four, or a new tablet for a student, or 4–5 tanks of gas.</li>
                  <li><span class="text-highlighted">Less serious:</span> 57 Chipotle burritos, or 46 movie tickets—enough for the whole unit to see a film together.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 4: Public sector -->
        <div class="rounded-xl border border-default bg-muted/10 p-6 border-l-4 border-l-violet-500">
          <div class="flex items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
              <UIcon name="i-lucide-landmark" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 4: Public agency quarterly full-day retreat</h4>
              <p class="text-muted text-sm mb-4">
                75 people (avg $70K/year, blended public-sector rate), 8am–4:30pm with 1 hour for lunch = 7.5 hours. At 8am: <strong class="text-highlighted">$0</strong>. At 4:30pm: 75 × ($70,000 ÷ 2,080) × 7.5 = <strong class="text-highlighted">~$18,900</strong> per meeting. Quarterly = 4× per year: <strong class="text-highlighted">~$75,600</strong> annually. <em>Taxpayer dollars.</em>
              </p>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Or that could buy…</p>
                <ul class="text-muted space-y-1 text-sm">
                  <li><span class="text-highlighted">Serious (per meeting):</span> 2–3 police body cameras, or 9 months of school lunches for 100 kids. <span class="text-highlighted">Per year:</span> a full-time entry-level teacher salary, or a year of rent for 5–6 low-income families.</li>
                  <li><span class="text-highlighted">Less serious:</span> Per meeting: 1,575 burritos—enough for every attendee to have 21 each. Per year: a small fleet of burritos.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 5 -->
        <div class="rounded-xl border border-default bg-muted/10 p-6 border-l-4 border-l-emerald-500">
          <div class="flex items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <UIcon name="i-lucide-sunrise" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 5: 15-minute daily standup</h4>
              <p class="text-muted text-sm mb-4">
                5-person team (avg $100K/year), 15-minute daily standup. 5 × ($100,000 ÷ 2,080) × 0.25 = <strong class="text-highlighted">$60</strong> per meeting. Daily = ~260 working days/year: <strong class="text-highlighted">~$15,600/year</strong>.
              </p>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Or that could buy…</p>
                <ul class="text-muted space-y-1 text-sm">
                  <li><span class="text-highlighted">Serious:</span> Per day: a tank of gas. Per year: a used car, or a year of community college—for a meeting that often could've been a Slack message.</li>
                  <li><span class="text-highlighted">Less serious:</span> Per day: 5 burritos. Per year: 1,300 lattes—one per standup, for the whole team.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="text-muted leading-relaxed mt-8">
        <NuxtLink to="/" class="text-primary hover:underline font-medium">
          ← Back to home
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
