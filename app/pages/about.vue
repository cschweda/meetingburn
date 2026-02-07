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
        How sharing works (privacy-first)
      </h2>
      <p class="text-muted leading-relaxed mb-4">
        When you share a receipt, MeetCost creates a shareable link that contains only the <strong>summary data</strong> (total cost, duration, participant count, sector, meeting type)—no names, no salaries, no hourly rates. The link looks like this:
      </p>
      <p class="text-sm text-muted leading-relaxed mb-4 font-mono bg-muted/30 p-3 rounded">
        meetcost.app/share?r=eyJ0IjoxNzM4ODk...
      </p>
      
      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        What is Base64 encoding?
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        Base64 is a simple text format that converts data into a URL-safe string of letters, numbers, and a few symbols. It's <strong>not encryption</strong>—it's just a way to pack data into a link. Think of it like a ZIP file for URLs: it makes the data compact and safe to share in a web address.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        <strong>Here's what happens:</strong>
      </p>
      <ul class="text-muted leading-relaxed mb-4 list-disc list-inside space-y-1">
        <li><strong>Step 1:</strong> Your browser (locally, on your device) takes the meeting summary and converts it to Base64 text.</li>
        <li><strong>Step 2:</strong> That text becomes part of the share link.</li>
        <li><strong>Step 3:</strong> When someone clicks your link, <em>their</em> browser decodes the Base64 text and displays the receipt.</li>
      </ul>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        You control who sees the data
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        Base64 is not a secret code. Anyone with the link can decode it (it's just converting text back to numbers). But <strong>only people you send the link to can see the data</strong>. No one else has the link. MeetCost never stores your data on a server—there are no servers. The encoding and decoding both happen in your browser and the recipient's browser. It's entirely in your hands.
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        What's in the share link?
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        The share URL contains only aggregated, anonymized data:
      </p>
      <ul class="text-muted leading-relaxed mb-4 list-disc list-inside space-y-1">
        <li>Meeting timestamp (date/time)</li>
        <li>Duration (seconds)</li>
        <li>Number of participants</li>
        <li>Total cost and average rate (calculated)</li>
        <li>Sector (public/private) and meeting type</li>
        <li>Breakdown (how many full-time/contractor/unknown—no individual details)</li>
      </ul>
      <p class="text-muted leading-relaxed mb-4">
        <strong>What's NOT shared:</strong> Individual participant salaries, hourly rates, names, roles, or any personally identifiable information. The recipient sees only the final cost summary.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        <strong>Bottom line:</strong> Sharing is safe because you choose who gets the link, and the link contains only summary data—never individual compensation details.
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
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm">
                  <li>About 1 hour of consultant time at $175/hr</li>
                  <li>4 enterprise software licenses per month ($75 each)</li>
                  <li>4 project management licenses for a year ($15/mo each)</li>
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
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm">
                  <li>Per meeting: 2 days of contractor pay ($600/day), or 20 enterprise licenses per month</li>
                  <li>Per year: 25 training course seats ($750 each), or 2 conference registrations ($1,200 each), or 200 consultant hours</li>
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
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm">
                  <li>4 hours of consultant time ($175/hr)</li>
                  <li>1 conference registration ($1,200)</li>
                  <li>9 enterprise software licenses per month</li>
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
                <p class="font-medium text-highlighted mb-2">Business equivalent (taxpayer dollars):</p>
                <ul class="text-muted space-y-1 text-sm">
                  <li>Per meeting: 25 training course seats, or 15 laptop replacements, or 108 consultant hours</li>
                  <li>Per year: 100 training seats, or 63 laptops, or a full-time entry-level public-sector salary</li>
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
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm">
                  <li>Per day: 1 hour of contractor time ($60). Per year: 26 training course seats, or 13 laptop replacements—for a meeting that often could've been a Slack message.</li>
                  <li>Annual cost: 1,040 enterprise software licenses, or 104 consultant hours</li>
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
