<script setup lang="ts">
const { appName, aboutDescription, siteUrl } = useMeetingBurnConfig()
useSeoMeta({
  title: `About ${appName}`,
  description: aboutDescription,
  ogImage: `${siteUrl}/og-image.png`,
  twitterCard: 'summary_large_image',
})

const { computeMeetingScore } = useMeetingScore()
const showScores = ref(false)

const EXAMPLE_SCORES = [
  { totalCost: 69.95, format: 'remote' as const, meetingType: 'Sync', durationSeconds: 30 * 60, participantCount: 3, inPersonCost: 0 },
  { totalCost: 288, format: 'remote' as const, meetingType: 'Sync', durationSeconds: 60 * 60, participantCount: 6, inPersonCost: 0 },
  { totalCost: 1177, format: 'in-person' as const, meetingType: 'Status Update', durationSeconds: 60 * 60, participantCount: 15, inPersonCost: 542 },
  { totalCost: 20282, format: 'remote' as const, meetingType: 'All Hands', durationSeconds: 7.5 * 3600, participantCount: 75, inPersonCost: 0 },
  { totalCost: 66, format: 'remote' as const, meetingType: 'Stand Up', durationSeconds: 15 * 60, participantCount: 5, inPersonCost: 0 },
  { totalCost: 340, format: 'in-person' as const, meetingType: 'Kickoff', durationSeconds: 60 * 60, participantCount: 4, inPersonCost: 167 },
  { totalCost: 24112, format: 'in-person' as const, meetingType: 'All Hands', durationSeconds: 8 * 3600, participantCount: 75, inPersonCost: 2477 },
  { totalCost: 900, format: 'remote' as const, meetingType: 'Strategy', durationSeconds: 2 * 3600, participantCount: 3, inPersonCost: 0 },
  { totalCost: 245, format: 'remote' as const, meetingType: 'Status Update', durationSeconds: 45 * 60, participantCount: 8, inPersonCost: 0 },
  { totalCost: 708, format: 'in-person' as const, meetingType: 'General', durationSeconds: 60 * 60, participantCount: 12, inPersonCost: 316 },
]

const exampleScores = computed(() =>
  EXAMPLE_SCORES.map((input) => computeMeetingScore(input))
)
</script>

<template>
  <div class="container mx-auto px-4 py-16 max-w-2xl">
    <h1 class="text-3xl font-bold text-highlighted mb-6">
      About {{ appName }}
    </h1>
    <div class="prose prose-neutral dark:prose-invert max-w-none break-words">
      <!-- General overview -->
      <p id="privacy" class="text-muted leading-relaxed mb-4">
        {{ appName }} makes invisible meeting waste visible. A live-ticking counter shows dollar-per-second burn rates and creates shareable receipts that drive behavior change in corporate meeting culture.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        <strong>Core value:</strong> Transform abstract meeting time into concrete financial data with shareability.
      </p>

      <!-- When remote/async makes sense -->
      <h2 class="text-xl font-semibold text-highlighted mt-10 mb-3">
        When remote beats in-person (and when it doesn't)
      </h2>
      <p class="text-muted leading-relaxed mb-4">
        Remote meetings (Zoom, Teams, Webex) can be <strong>more effective</strong> than in-person for many use cases: no commute, no room booking, easier to record and replay, and—crucially for makers and creatives—less disruption to flow state. In-person all-hands often require everyone to travel, sit in a room, and listen to updates that could have been a Slack message or a 5-minute async video. The cost is the same either way; the question is whether the format justifies it.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        In-person still wins for team building, complex negotiations, and whiteboard brainstorming. But for status updates, standups, and one-way announcements, remote (or better yet, async Slack/Teams) is often more efficient and less draining. MeetingBurn helps you see the cost either way—so you can decide whether the meeting format is worth it.
      </p>

      <!-- Calculation details -->
      <h2 id="how-it-works" class="text-xl font-semibold text-highlighted mt-10 mb-3">
        How meeting cost is calculated
      </h2>
      <p class="text-muted leading-relaxed mb-4">
        MeetingBurn converts each participant's compensation into an hourly rate, sums those rates, and multiplies by meeting duration. All math runs in your browser—no data is sent anywhere.
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        Hourly rate per participant
      </h3>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
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

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        In-person “tax” (usually paid by employees)
      </h3>
      <p class="text-muted leading-relaxed mb-2">
        In-person meetings add hidden costs that most companies don’t cover: commute time, coffee, parking, childcare, etc. These are typically paid by employees, not the employer.
      </p>
      <p class="text-muted leading-relaxed mb-2">
        When you choose “In-person” and include this cost, we add:
      </p>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
        <li><strong class="text-highlighted">Included by default—commute time value:</strong> The dollar value of time spent commuting. Formula: sum of hourly rates × (round-trip minutes ÷ 60). Default is 30 minutes.</li>
        <li><strong class="text-highlighted">Extra cost (optional):</strong> Out-of-pocket expenses beyond commute time, e.g. coffee, parking, childcare, tolls. Add a per-person dollar amount if applicable.</li>
      </ul>
      <p class="text-muted leading-relaxed mb-6">
        The receipt itemizes <strong>Company pays</strong> (meeting time) vs <strong>Each employee pays (avg)</strong> (per-person average—not exact; commute, daycare, coffee, etc. vary) and <strong>All employees together pay</strong> (total), so it’s clear who bears which cost.
      </p>

      <h2 id="scoring-algorithm" class="text-xl font-semibold text-highlighted mt-16 mb-3">
        How meeting scores are calculated
      </h2>
      <p class="text-muted leading-relaxed mb-4">
        Meeting scores (0–100) evaluate meeting efficiency based on format, participant count, duration, and meeting type. The algorithm is designed to surface evidence-based patterns of meeting waste while accounting for legitimate use cases. Scores are <strong>subjective and opinionated</strong>—meant to spark reflection, not dictate policy.
      </p>
      <p class="text-muted leading-relaxed mb-4 text-sm italic">
        <strong>Note:</strong> Scores are only visible when you toggle them on. They're never shown in shared receipts, downloads, or clipboard copies. This is intentional: scores are for your own reflection, not for public judgment of colleagues or teams.
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        Algorithm principles
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        All meetings start at 100 points. Penalties are applied for patterns associated with meeting inefficiency. Bonuses are rare and small (e.g., +5 for efficient remote async-friendly meetings).
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        1. Format appropriateness: Remote vs. in-person
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        <strong>Remote meetings are generally preferred</strong> for routine work. Research shows remote work reduces commute time, increases flexibility, and—crucially for knowledge workers—preserves <a href="https://www.apa.org/pubs/journals/releases/amp-a0035161.pdf" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">flow state</a> (Csikszentmihalyi, 2014). A <a href="https://wfhresearch.com/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">2023 Stanford study</a> found remote workers saved an average of 72 minutes per day on commuting, with no productivity loss for collaborative or creative tasks.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        <strong>In-person meetings are penalized unless justified.</strong> The algorithm recognizes that some meeting types benefit from in-person presence (brainstorming, kickoffs, team building), while others do not (status updates, standups, announcements). Research by <a href="https://journals.sagepub.com/doi/10.1177/0149206314525205" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Mroz et al. (2018)</a> found that face-to-face meetings are most valuable for complex problem-solving and relationship-building, but offer minimal advantage for information dissemination.
      </p>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
        <li><strong>In-person for async-friendly types</strong> (standups, status updates): -22 points. These meetings are candidates for Slack/email or short async video.</li>
        <li><strong>In-person without clear justification:</strong> -8 points. If the meeting type isn't explicitly collaborative (brainstorming, kickoff, etc.), remote is preferred.</li>
        <li><strong>Remote for async-friendly types:</strong> +5 points. Recognizes efficient format choice.</li>
      </ul>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        2. Participant count: Coordination overhead
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        <strong>Larger meetings increase coordination costs and reduce participation.</strong> Research by <a href="https://hbr.org/2017/05/how-to-keep-your-team-focused-and-productive" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Woolley et al. (2010, MIT)</a> found that optimal team size for collaborative work is 3–5 people. Beyond 8 people, participation drops and "social loafing" increases (individuals contribute less as group size grows). <a href="https://www.psychologytoday.com/us/blog/canine-corner/201508/social-loafing-why-some-people-do-less-work-when-theyre-group" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Latané et al. (1979)</a> demonstrated this effect across multiple studies.
      </p>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
        <li><strong>8–14 participants:</strong> -5 points. Medium-sized meetings require intentionality. Ask: does everyone need to be here?</li>
        <li><strong>15+ participants (async-friendly):</strong> -12 points. Large audience for a simple meeting type suggests broadcast (email, video) would be more efficient.</li>
        <li><strong>25+ participants:</strong> -8 points. Large meetings are harder to coordinate and reduce individual engagement.</li>
        <li><strong>50+ participants:</strong> -8 points (cumulative). Very large meetings often become one-way broadcasts. Consider async alternatives.</li>
        <li><strong>50+ in-person:</strong> Additional -10 points. Large in-person gatherings amplify cost and coordination complexity.</li>
      </ul>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        3. Duration: Time is expensive
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        <strong>Long meetings for simple tasks are inefficient.</strong> <a href="https://hbr.org/2022/03/how-to-finally-kill-the-useless-recurring-meeting" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Harvard Business Review (2022)</a> reports that the average professional spends 21.5 hours per week in meetings, with 71% of those meetings considered unproductive. Status updates and standups should be short—15 minutes or less. Longer durations for these types suggest inefficiency or lack of preparation.
      </p>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
        <li><strong>Async-friendly meeting >1 hour:</strong> -15 points. Status updates shouldn't take an hour. Consider async or breaking into smaller focused sessions.</li>
        <li><strong>Async-friendly meeting ≤15 min:</strong> +5 points. Efficient use of time.</li>
        <li><strong>In-person >4 hours:</strong> -6 points. Long in-person sessions amplify commute and opportunity cost.</li>
        <li><strong>In-person >6 hours:</strong> -12 points. All-day in-person meetings should be rare and highly justified.</li>
      </ul>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        4. In-person costs: Employee burden
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        <strong>In-person meetings impose hidden costs on employees.</strong> The U.S. Census Bureau reports the <a href="https://www.census.gov/newsroom/press-releases/2021/one-way-travel-time-to-work-rises.html" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">average one-way commute is 27.6 minutes</a> (55.2 minutes round-trip), costing employees time and money (gas, parking, childcare, etc.). Unlike meeting time—which the company pays for via salaries—these costs are borne by employees, not employers. <a href="https://www.pewresearch.org/short-reads/2022/02/16/covid-19-pandemic-continues-to-reshape-work-in-america/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Pew Research (2022)</a> found that 64% of remote-capable workers prefer hybrid or fully remote schedules specifically to avoid commuting.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        <strong>For remote meetings, cost per attendee-hour is NOT penalized.</strong> The "cost" of a remote meeting is just time and salary—an expected cost of doing business. High hourly rates in remote meetings don't indicate inefficiency; they indicate that highly compensated employees are working.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        <strong>For in-person meetings, cost per attendee-hour IS penalized.</strong> High costs in in-person meetings reflect actual expenses beyond salary (commute, parking, lost productivity, opportunity cost). These penalties encourage teams to ask: "Is in-person worth the extra cost?"
      </p>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
        <li><strong>In-person cost >30% of total:</strong> -10 points. Significant employee burden (long commutes, parking, extras).</li>
        <li><strong>In-person cost >$500 total:</strong> -6 points. Notable employee cost.</li>
        <li><strong>Total cost >$8,000:</strong> -10 points. High total cost (e.g., $10K meeting with 50 people for 2 hours).</li>
        <li><strong>Total cost >$15,000:</strong> -18 points. Very high total cost (e.g., $24K all-day meeting).</li>
        <li><strong>In-person cost per attendee-hour >$150:</strong> -20 points. Very high cost per person (time + commute + extras).</li>
        <li><strong>In-person cost per attendee-hour >$100:</strong> -10 points. Above-average cost per person.</li>
      </ul>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        What meeting types are "async-friendly"?
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        The algorithm considers the following types async-friendly (Slack, email, async video, etc.):
      </p>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
        <li>Stand Up</li>
        <li>Status Update</li>
        <li>Sync</li>
        <li>Touch Base</li>
        <li>Review</li>
      </ul>
      <p class="text-muted leading-relaxed mb-4">
        These types are informational and don't require real-time interaction. Research by <a href="https://dl.acm.org/doi/10.1145/3290605.3300590" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Iqbal & Horvitz (CHI 2019)</a> found that async communication reduces interruptions and preserves focus time, particularly for engineers, designers, and writers.
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        What meeting types justify in-person?
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        The algorithm recognizes these types as potentially benefiting from in-person presence:
      </p>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
        <li>Brainstorm</li>
        <li>Kickoff</li>
        <li>All Hands</li>
      </ul>
      <p class="text-muted leading-relaxed mb-4">
        Even so, long or very large in-person sessions for these types still receive penalties, as the cost and coordination overhead may outweigh the benefits.
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        Score interpretation
      </h3>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
        <li><strong>85–100:</strong> Efficient. Remote, lean, and justified.</li>
        <li><strong>70–84:</strong> Decent. Could be async or smaller, but not egregious.</li>
        <li><strong>50–69:</strong> Questionable. Strong "could have been an email" energy.</li>
        <li><strong>0–49:</strong> Inefficient. High cost, large audience, or poor format choice.</li>
      </ul>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        Why scores are subjective
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        Meeting efficiency depends on context. A 50-person in-person all-hands might be worth it for a company-wide announcement or culture-building event, even if it scores low. Conversely, a 5-person remote brainstorm might score high but still be unproductive if participants aren't prepared. <strong>Scores are a starting point for reflection, not a verdict.</strong>
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        Research sources
      </h3>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-2 text-sm">
        <li>Csikszentmihalyi, M. (2014). <em>Flow and the Foundations of Positive Psychology.</em> Springer. <a href="https://www.apa.org/pubs/journals/releases/amp-a0035161.pdf" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">APA link</a></li>
        <li>Barrero, J. M., Bloom, N., & Davis, S. J. (2023). <em>Why Working from Home Will Stick.</em> Stanford WFH Research. <a href="https://wfhresearch.com/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">wfhresearch.com</a></li>
        <li>Mroz, J. E., Allen, J. A., Verhoeven, D. C., & Shuffler, M. L. (2018). Do We Really Need Another Meeting? <em>Journal of Management.</em> <a href="https://journals.sagepub.com/doi/10.1177/0149206314525205" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">SAGE link</a></li>
        <li>Woolley, A. W., Chabris, C. F., Pentland, A., Hashmi, N., & Malone, T. W. (2010). Evidence for a Collective Intelligence Factor in Groups. <em>Science, 330</em>(6004), 686–688. <a href="https://www.science.org/doi/10.1126/science.1193147" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Science link</a></li>
        <li>Latané, B., Williams, K., & Harkins, S. (1979). Many hands make light the work. <em>Journal of Personality and Social Psychology, 37</em>(6), 822–832.</li>
        <li>Perlow, L. A., Hadley, C. N., & Eun, E. (2017). Stop the Meeting Madness. <em>Harvard Business Review.</em> <a href="https://hbr.org/2022/03/how-to-finally-kill-the-useless-recurring-meeting" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">HBR link</a></li>
        <li>U.S. Census Bureau (2021). <em>One-Way Travel Time to Work Rises.</em> <a href="https://www.census.gov/newsroom/press-releases/2021/one-way-travel-time-to-work-rises.html" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Census link</a></li>
        <li>Parker, K., Horowitz, J. M., & Minkin, R. (2022). COVID-19 Pandemic Continues to Reshape Work in America. <em>Pew Research Center.</em> <a href="https://www.pewresearch.org/short-reads/2022/02/16/covid-19-pandemic-continues-to-reshape-work-in-america/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Pew link</a></li>
        <li>Iqbal, S. T., & Horvitz, E. (2019). Regulating Workplace Interruptions. <em>CHI 2019.</em> <a href="https://dl.acm.org/doi/10.1145/3290605.3300590" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">ACM link</a></li>
      </ul>

      <h2 id="sharing" class="text-xl font-semibold text-highlighted mt-16 mb-3">
        Sharing & Privacy
      </h2>
      <p class="text-muted leading-relaxed mb-4">
        All data stays in your browser. No tracking, no servers, no accounts. Privacy-first by design.
      </p>
      <p class="text-muted leading-relaxed mb-4">
        <strong>History & storage:</strong> Meeting history is stored in your browser's local storage—local to your device and to your browser. You can clear it at any time. No data leaves your browser. Ever.
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        How sharing works (privacy-first)
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        When you share a receipt, MeetingBurn creates a shareable link that contains only the <strong>summary data</strong> (total cost, duration, participant count, sector, meeting type)—no names, no salaries, no hourly rates. The link looks like this:
      </p>
      <p class="text-sm text-muted leading-relaxed mb-4 font-mono bg-muted/30 p-3 rounded">
        meetingburn.app/share?r=eyJ0IjoxNzM4ODk...
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
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
        <li><strong>Step 1:</strong> Your browser (locally, on your device) takes the meeting summary and converts it to Base64 text.</li>
        <li><strong>Step 2:</strong> That text becomes part of the share link.</li>
        <li><strong>Step 3:</strong> When someone clicks your link, <em>their</em> browser decodes the Base64 text and displays the receipt.</li>
      </ul>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        You control who sees the data
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        Base64 is not a secret code. Anyone with the link can decode it (it's just converting text back to numbers). But <strong>only people you send the link to can see the data</strong>. No one else has the link. MeetingBurn never stores your data on a server—there are no servers. The encoding and decoding both happen in your browser and the recipient's browser. It's entirely in your hands.
      </p>

      <h3 class="text-lg font-medium text-highlighted mt-6 mb-2">
        What's in the share link?
      </h3>
      <p class="text-muted leading-relaxed mb-4">
        The share URL contains only aggregated, anonymized data:
      </p>
      <ul class="text-muted leading-relaxed mb-4 list-disc pl-5 space-y-1">
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

      <h2 id="examples" class="text-xl font-semibold text-highlighted mt-16 mb-3">
        Examples
      </h2>
      <p class="text-muted leading-relaxed text-sm mb-6 italic">
        All salary and hourly rates in these examples are from
        <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> average salaries for 2026,
        <a href="https://www.payscale.com/research-and-insights/us-compensation-trends" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">PayScale</a>,
        <a href="https://www.roberthalf.com/us/en/insights/salary-guide" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Robert Half</a>, and
        <a href="https://motionrecruitment.com/it-salary" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Motion Recruitment</a>.
        Actual costs may be higher depending on your organization's compensation.
      </p>

      <div class="mb-8 flex justify-center">
        <UButton
          v-if="!showScores"
          size="xl"
          color="primary"
          variant="soft"
          icon="i-lucide-gauge"
          class="font-bold text-lg px-8 py-4"
          @click="showScores = true"
        >
          Show meeting scores
        </UButton>
        <UButton
          v-else
          size="xl"
          color="neutral"
          variant="soft"
          icon="i-lucide-gauge"
          class="font-bold text-lg px-8 py-4"
          @click="showScores = false"
        >
          Hide meeting scores
        </UButton>
      </div>

      <div class="space-y-8">
        <!-- Example 1 -->
        <div class="rounded-xl border border-default bg-muted/10 p-4 sm:p-6 border-l-4 border-l-primary">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-primary/15 text-primary">
              <UIcon name="i-lucide-users-2" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 1: The 30‑minute sync (Remote)</h4>
              <div class="text-muted text-sm mb-3 space-y-1">
                <p><strong>Format:</strong> Remote · <strong>Sector:</strong> Private · <strong>Preset:</strong> Tech / Software</p>
                <p><strong>Participants:</strong> 3 people at $97K/year · <strong>Duration:</strong> 30 minutes</p>
              </div>
              <ul class="text-muted text-sm mb-4 space-y-1 list-none">
                <li><strong>Meeting cost:</strong> 3 × ($97,000 ÷ 2,080) × 0.5 hr = <strong class="text-highlighted">$69.95</strong></li>
                <li>Company pays $69.95</li>
              </ul>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~25 minutes of consultant time ($175/hr)</li>
                  <li>1 enterprise software license per month</li>
                  <li>4 project management licenses for a year ($15/mo each)</li>
                </ul>
                <p class="font-medium text-highlighted mt-3 mb-2">Lunch-break equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~12 lattes or salads</li>
                  <li>~6 burritos</li>
                </ul>
                <p class="text-muted text-sm mt-2 italic">—Could this have been a Slack or Teams message? Async updates often work for status syncs.</p>
                <div v-if="showScores" class="mt-3 pt-3 border-t border-default/50 flex flex-wrap items-start gap-4">
                  <MeetingScoreGauge :score="exampleScores[0].score" :size="100" />
                  <div class="flex flex-col gap-1 min-w-0">
                    <p class="text-muted text-sm italic">{{ exampleScores[0].text }}</p>
                    <ul v-if="exampleScores[0].factors.length" class="text-muted text-xs mt-1 list-disc pl-5">
                      <li v-for="f in exampleScores[0].factors" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 2 -->
        <div class="rounded-xl border border-default bg-muted/10 p-4 sm:p-6 border-l-4 border-l-amber-500">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <UIcon name="i-lucide-repeat" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 2: The recurring meeting drain (Remote)</h4>
              <div class="text-muted text-sm mb-3 space-y-1">
                <p><strong>Format:</strong> Remote · <strong>Sector:</strong> Private · <strong>Preset:</strong> Pharma / Biotech</p>
                <p><strong>Participants:</strong> 6 people at $100K/year · <strong>Duration:</strong> 1 hour (weekly)</p>
              </div>
              <ul class="text-muted text-sm mb-4 space-y-1 list-none">
                <li><strong>Meeting cost:</strong> 6 × ($100,000 ÷ 2,080) × 1 hr = <strong class="text-highlighted">$288</strong> per meeting</li>
                <li>Per year (52 weeks): <strong class="text-highlighted">~$15,000</strong></li>
                <li>Company pays $288/meeting</li>
              </ul>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <p class="text-muted text-sm font-medium mt-2 mb-1">Per meeting:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>1.5 hours of consultant time ($175/hr)</li>
                  <li>4 enterprise licenses per month ($75 each)</li>
                </ul>
                <p class="text-muted text-sm font-medium mt-2 mb-1">Per year:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>20 training course seats ($750 each)</li>
                  <li>1 conference registration ($1,200)</li>
                  <li>86 hours of consultant time ($175/hr)</li>
                </ul>
                <p class="font-medium text-highlighted mt-3 mb-2">Lunch-break equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>Per meeting: ~48 lattes or ~24 burritos</li>
                  <li>Per year: ~2,500 lattes or ~1,250 burritos</li>
                </ul>
                <p class="text-muted text-sm mt-2 italic">—Could this have been a Slack or Teams message? Weekly syncs often repeat the same info—a shared doc or async update might suffice.</p>
                <div v-if="showScores" class="mt-3 pt-3 border-t border-default/50 flex flex-wrap items-start gap-4">
                  <MeetingScoreGauge :score="exampleScores[1].score" :size="100" />
                  <div class="flex flex-col gap-1 min-w-0">
                    <p class="text-muted text-sm italic">{{ exampleScores[1].text }}</p>
                    <ul v-if="exampleScores[1].factors.length" class="text-muted text-xs mt-1 list-disc pl-5">
                      <li v-for="f in exampleScores[1].factors" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 3 -->
        <div class="rounded-xl border border-default bg-muted/10 p-4 sm:p-6 border-l-4 border-l-blue-500">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <UIcon name="i-lucide-users" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 3: Unit meeting with 15 attendees (In-person)</h4>
              <div class="text-muted text-sm mb-3 space-y-1">
                <p><strong>Format:</strong> In-person · <strong>Sector:</strong> Private · <strong>Preset:</strong> Corporate</p>
                <p><strong>Participants:</strong> 15 people at $88K/year · <strong>Duration:</strong> 1 hour</p>
                <p><strong>In-person:</strong> 30 min commute, $15/person coffee/parking</p>
              </div>
              <ul class="text-muted text-sm mb-4 space-y-1 list-none">
                <li><strong>Meeting cost:</strong> 15 × ($88,000 ÷ 2,080) × 1 hr = $635</li>
                <li><strong>In-person tax:</strong> Commute $635 × (30÷60) = $317; Extras 15 × $15 = $225 → <strong class="text-highlighted">$542</strong></li>
                <li><strong>Total:</strong> <strong class="text-highlighted">$1,177</strong> · Company $635; employees $542</li>
              </ul>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~7 hours of consultant time ($175/hr)</li>
                  <li>1 conference registration ($1,200)</li>
                  <li>16 enterprise software licenses per month ($75 each)</li>
                </ul>
                <p class="font-medium text-highlighted mt-3 mb-2">Lunch-break equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~196 lattes or salads</li>
                  <li>~98 burritos</li>
                </ul>
                <p class="text-muted text-sm mt-2 italic">—Could this have been a Slack or Teams message? Large meetings sap concentration from knowledge workers; a thread or announcement often reaches everyone without the cost.</p>
                <div v-if="showScores" class="mt-3 pt-3 border-t border-default/50 flex flex-wrap items-start gap-4">
                  <MeetingScoreGauge :score="exampleScores[2].score" :size="100" />
                  <div class="flex flex-col gap-1 min-w-0">
                    <p class="text-muted text-sm italic">{{ exampleScores[2].text }}</p>
                    <ul v-if="exampleScores[2].factors.length" class="text-muted text-xs mt-1 list-disc pl-5">
                      <li v-for="f in exampleScores[2].factors" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 4 -->
        <div class="rounded-xl border border-default bg-muted/10 p-4 sm:p-6 border-l-4 border-l-violet-500">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
              <UIcon name="i-lucide-landmark" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 4: Public agency quarterly full-day retreat (Remote)</h4>
              <div class="text-muted text-sm mb-3 space-y-1">
                <p><strong>Format:</strong> Remote · <strong>Sector:</strong> Public (taxpayer dollars) · <strong>Preset:</strong> Government / Public Sector</p>
                <p><strong>Participants:</strong> 75 people at $75K/year · <strong>Duration:</strong> 8am–4:30pm with 1 hr lunch = 7.5 hours</p>
              </div>
              <ul class="text-muted text-sm mb-4 space-y-1 list-none">
                <li><strong>Meeting cost:</strong> 75 × ($75,000 ÷ 2,080) × 7.5 hrs = <strong class="text-highlighted">~$20,282</strong> per meeting</li>
                <li>Quarterly (4×/year): <strong class="text-highlighted">~$81,130</strong> annually</li>
                <li>Agency pays $20,282/meeting</li>
              </ul>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <p class="text-muted text-sm font-medium mt-2 mb-1">Per meeting:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>27 training course seats ($750 each)</li>
                  <li>17 laptop replacements ($1,200 each)</li>
                  <li>116 hours of consultant time ($175/hr)</li>
                </ul>
                <p class="text-muted text-sm font-medium mt-2 mb-1">Per year:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>108 training course seats ($750 each)</li>
                  <li>68 laptop replacements ($1,200 each)</li>
                  <li>Full-time entry-level public-sector salary</li>
                </ul>
                <p class="font-medium text-highlighted mt-3 mb-2">Lunch-break equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>Per meeting: ~3,380 lattes ($6) or ~1,690 burritos ($12)</li>
                  <li>Per year: ~13,500 lattes or ~6,760 burritos</li>
                </ul>
                <p class="text-muted text-sm mt-2 italic">—Retreats serve team-building. But routine "all hands" updates could often be a Slack or Teams message instead.</p>
                <div v-if="showScores" class="mt-3 pt-3 border-t border-default/50 flex flex-wrap items-start gap-4">
                  <MeetingScoreGauge :score="exampleScores[3].score" :size="100" />
                  <div class="flex flex-col gap-1 min-w-0">
                    <p class="text-muted text-sm italic">{{ exampleScores[3].text }}</p>
                    <ul v-if="exampleScores[3].factors.length" class="text-muted text-xs mt-1 list-disc pl-5">
                      <li v-for="f in exampleScores[3].factors" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 5 -->
        <div class="rounded-xl border border-default bg-muted/10 p-4 sm:p-6 border-l-4 border-l-emerald-500">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <UIcon name="i-lucide-sunrise" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 5: 15-minute daily standup (Remote)</h4>
              <div class="text-muted text-sm mb-3 space-y-1">
                <p><strong>Format:</strong> Remote · <strong>Sector:</strong> Private · <strong>Preset:</strong> Finance / Banking</p>
                <p><strong>Participants:</strong> 5 people at $110K/year · <strong>Duration:</strong> 15 minutes (daily)</p>
              </div>
              <ul class="text-muted text-sm mb-4 space-y-1 list-none">
                <li><strong>Meeting cost:</strong> 5 × ($110,000 ÷ 2,080) × 0.25 hr = <strong class="text-highlighted">$66</strong> per meeting</li>
                <li>Per year (~260 days): <strong class="text-highlighted">~$17,188</strong></li>
                <li>Company pays $66/meeting</li>
              </ul>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <p class="text-muted text-sm font-medium mt-2 mb-1">Per day:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>23 minutes of consultant time ($175/hr)</li>
                </ul>
                <p class="text-muted text-sm font-medium mt-2 mb-1">Per year:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>23 training course seats ($750 each)</li>
                  <li>14 laptop replacements ($1,200 each)</li>
                  <li>229 enterprise software licenses per month ($75 each)</li>
                  <li>98 hours of consultant time ($175/hr)</li>
                </ul>
                <p class="font-medium text-highlighted mt-3 mb-2">Lunch-break equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>Per day: ~11 lattes or ~5 burritos</li>
                  <li>Per year: ~2,860 lattes or ~1,430 burritos</li>
                </ul>
                <p class="text-muted text-sm mt-2 italic">—Could this have been a Slack or Teams message? Daily standups often could—async updates can be just as effective without disrupting deep work for makers and creatives.</p>
                <div v-if="showScores" class="mt-3 pt-3 border-t border-default/50 flex flex-wrap items-start gap-4">
                  <MeetingScoreGauge :score="exampleScores[4].score" :size="100" />
                  <div class="flex flex-col gap-1 min-w-0">
                    <p class="text-muted text-sm italic">{{ exampleScores[4].text }}</p>
                    <ul v-if="exampleScores[4].factors.length" class="text-muted text-xs mt-1 list-disc pl-5">
                      <li v-for="f in exampleScores[4].factors" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 6 -->
        <div class="rounded-xl border border-default bg-muted/10 p-4 sm:p-6 border-l-4 border-l-rose-500">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <UIcon name="i-lucide-map-pin" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 6: 4-person in-person kickoff (In-person)</h4>
              <div class="text-muted text-sm mb-3 space-y-1">
                <p><strong>Format:</strong> In-person · <strong>Sector:</strong> Private · <strong>Preset:</strong> Energy / Utilities</p>
                <p><strong>Participants:</strong> 4 people at $90K/year · <strong>Duration:</strong> 1 hour</p>
                <p><strong>In-person:</strong> 30 min commute, $20/person coffee/parking</p>
              </div>
              <ul class="text-muted text-sm mb-4 space-y-1 list-none">
                <li><strong>Meeting cost:</strong> 4 × ($90,000 ÷ 2,080) × 1 hr = $173</li>
                <li><strong>In-person tax:</strong> Commute $173 × (30÷60) = $87; Extras 4 × $20 = $80 → <strong class="text-highlighted">$167</strong></li>
                <li><strong>Total:</strong> <strong class="text-highlighted">$340</strong> · Company $173; employees $167 (~$42/person avg)</li>
              </ul>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~2 hours of consultant time ($175/hr)</li>
                  <li>4–5 enterprise licenses per month ($75 each)</li>
                </ul>
                <p class="font-medium text-highlighted mt-3 mb-2">Lunch-break equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~57 lattes or ~28 burritos</li>
                </ul>
                <p class="text-muted text-sm mt-2 italic">—In-person has value for relationship-building. But the hidden employee cost (commute, parking, daycare) is real—often paid out of pocket.</p>
                <div v-if="showScores" class="mt-3 pt-3 border-t border-default/50 flex flex-wrap items-start gap-4">
                  <MeetingScoreGauge :score="exampleScores[5].score" :size="100" />
                  <div class="flex flex-col gap-1 min-w-0">
                    <p class="text-muted text-sm italic">{{ exampleScores[5].text }}</p>
                    <ul v-if="exampleScores[5].factors.length" class="text-muted text-xs mt-1 list-disc pl-5">
                      <li v-for="f in exampleScores[5].factors" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 7 -->
        <div class="rounded-xl border border-default bg-muted/10 p-4 sm:p-6 border-l-4 border-l-cyan-500">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <UIcon name="i-lucide-landmark" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 7: 75-person in-person all-hands all-day (In-person)</h4>
              <div class="text-muted text-sm mb-3 space-y-1">
                <p><strong>Format:</strong> In-person · <strong>Sector:</strong> Public (taxpayer dollars) · <strong>Preset:</strong> Government / Public Sector</p>
                <p><strong>Participants:</strong> 75 people at $75K/year · <strong>Duration:</strong> 8:30am–5pm with 30-min lunch = 8 hours</p>
                <p><strong>In-person:</strong> 30 min commute, $15/person coffee/parking</p>
              </div>
              <ul class="text-muted text-sm mb-4 space-y-1 list-none">
                <li><strong>Meeting cost:</strong> 75 × ($75,000 ÷ 2,080) × 8 hrs = $21,635</li>
                <li><strong>In-person tax:</strong> Commute $2,704/hr × (30÷60) = $1,352; Extras 75 × $15 = $1,125 → <strong class="text-highlighted">$2,477</strong></li>
                <li><strong>Total:</strong> <strong class="text-highlighted">~$24,112</strong> · Agency $21,635; employees $2,477 (~$33/person avg)</li>
              </ul>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~138 hours of consultant time ($175/hr)</li>
                  <li>~32 training course seats ($750 each)</li>
                  <li>~20 laptop replacements ($1,200 each)</li>
                </ul>
                <p class="font-medium text-highlighted mt-3 mb-2">Lunch-break equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~4,020 lattes ($6) or ~2,010 burritos ($12)</li>
                </ul>
                <p class="text-muted text-sm mt-2 italic">—Full-day in-person gatherings at scale carry a steep cost. Much of the employee burden (commute, parking, lunch) is paid out of pocket—often by people who could have received the same updates remotely.</p>
                <div v-if="showScores" class="mt-3 pt-3 border-t border-default/50 flex flex-wrap items-start gap-4">
                  <MeetingScoreGauge :score="exampleScores[6].score" :size="100" />
                  <div class="flex flex-col gap-1 min-w-0">
                    <p class="text-muted text-sm italic">{{ exampleScores[6].text }}</p>
                    <ul v-if="exampleScores[6].factors.length" class="text-muted text-xs mt-1 list-disc pl-5">
                      <li v-for="f in exampleScores[6].factors" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 8 -->
        <div class="rounded-xl border border-default bg-muted/10 p-4 sm:p-6 border-l-4 border-l-indigo-500">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <UIcon name="i-lucide-briefcase" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 8: 2-hour strategy session with consultants (Remote)</h4>
              <div class="text-muted text-sm mb-3 space-y-1">
                <p><strong>Format:</strong> Remote · <strong>Sector:</strong> Private · <strong>Preset:</strong> Consulting</p>
                <p><strong>Participants:</strong> 3 contractors at $150/hr · <strong>Duration:</strong> 2 hours</p>
              </div>
              <ul class="text-muted text-sm mb-4 space-y-1 list-none">
                <li><strong>Meeting cost:</strong> 3 × $150/hr × 2 hrs = <strong class="text-highlighted">$900</strong></li>
                <li>Client pays $900</li>
              </ul>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~5 hours of consultant time ($175/hr)</li>
                  <li>12 enterprise software licenses per month ($75 each)</li>
                  <li>~1 training course seat ($750 each)</li>
                </ul>
                <p class="font-medium text-highlighted mt-3 mb-2">Lunch-break equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~150 lattes or ~75 burritos</li>
                </ul>
                <p class="text-muted text-sm mt-2 italic">—Strategy sessions have value. But with contractor rates, every minute counts—a concise agenda and clear deliverables maximize ROI.</p>
                <div v-if="showScores" class="mt-3 pt-3 border-t border-default/50 flex flex-wrap items-start gap-4">
                  <MeetingScoreGauge :score="exampleScores[7].score" :size="100" />
                  <div class="flex flex-col gap-1 min-w-0">
                    <p class="text-muted text-sm italic">{{ exampleScores[7].text }}</p>
                    <ul v-if="exampleScores[7].factors.length" class="text-muted text-xs mt-1 list-disc pl-5">
                      <li v-for="f in exampleScores[7].factors" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 9 -->
        <div class="rounded-xl border border-default bg-muted/10 p-4 sm:p-6 border-l-4 border-l-red-500">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400">
              <UIcon name="i-lucide-heart-pulse" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 9: 45-minute healthcare staff huddle (Remote)</h4>
              <div class="text-muted text-sm mb-3 space-y-1">
                <p><strong>Format:</strong> Remote · <strong>Sector:</strong> Private · <strong>Preset:</strong> Healthcare</p>
                <p><strong>Participants:</strong> 8 people at $85K/year · <strong>Duration:</strong> 45 minutes</p>
              </div>
              <ul class="text-muted text-sm mb-4 space-y-1 list-none">
                <li><strong>Meeting cost:</strong> 8 × ($85,000 ÷ 2,080) × 0.75 hr = <strong class="text-highlighted">$245</strong></li>
                <li>Organization pays $245</li>
              </ul>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~1.4 hours of consultant time ($175/hr)</li>
                  <li>3 enterprise software licenses per month ($75 each)</li>
                </ul>
                <p class="font-medium text-highlighted mt-3 mb-2">Lunch-break equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~41 lattes or ~20 burritos</li>
                </ul>
                <p class="text-muted text-sm mt-2 italic">—Healthcare staff meetings coordinate care and compliance. But 45 minutes adds up across departments—a quick async huddle or shared doc can often capture handoffs without blocking clinical time.</p>
                <div v-if="showScores" class="mt-3 pt-3 border-t border-default/50 flex flex-wrap items-start gap-4">
                  <MeetingScoreGauge :score="exampleScores[8].score" :size="100" />
                  <div class="flex flex-col gap-1 min-w-0">
                    <p class="text-muted text-sm italic">{{ exampleScores[8].text }}</p>
                    <ul v-if="exampleScores[8].factors.length" class="text-muted text-xs mt-1 list-disc pl-5">
                      <li v-for="f in exampleScores[8].factors" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 10 -->
        <div class="rounded-xl border border-default bg-muted/10 p-4 sm:p-6 border-l-4 border-l-orange-500">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="shrink-0 flex items-center justify-center size-14 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400">
              <UIcon name="i-lucide-graduation-cap" class="size-8" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-lg font-semibold text-highlighted mb-2">Example 10: Nonprofit board meeting (In-person)</h4>
              <div class="text-muted text-sm mb-3 space-y-1">
                <p><strong>Format:</strong> In-person · <strong>Sector:</strong> Private (nonprofit) · <strong>Preset:</strong> Nonprofit / Education</p>
                <p><strong>Participants:</strong> 12 people at $68K/year · <strong>Duration:</strong> 1 hour</p>
                <p><strong>In-person:</strong> 30 min commute, $10/person coffee/parking</p>
              </div>
              <ul class="text-muted text-sm mb-4 space-y-1 list-none">
                <li><strong>Meeting cost:</strong> 12 × ($68,000 ÷ 2,080) × 1 hr = $392</li>
                <li><strong>In-person tax:</strong> Commute $392 × (30÷60) = $196; Extras 12 × $10 = $120 → <strong class="text-highlighted">$316</strong></li>
                <li><strong>Total:</strong> <strong class="text-highlighted">$708</strong> · Org $392; board members $316 (~$26/person avg)</li>
              </ul>
              <div class="rounded-lg bg-default/50 p-4 text-sm">
                <p class="font-medium text-highlighted mb-2">Business equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~4 hours of consultant time ($175/hr)</li>
                  <li>9 enterprise software licenses per month ($75 each)</li>
                </ul>
                <p class="font-medium text-highlighted mt-3 mb-2">Lunch-break equivalent:</p>
                <ul class="text-muted space-y-1 text-sm list-disc pl-5">
                  <li>~118 lattes ($6) or ~59 burritos ($12)</li>
                </ul>
                <p class="text-muted text-sm mt-2 italic">—Board meetings drive governance. But nonprofits run lean—every dollar diverted to meetings is one less for mission. Hybrid or async options can trim cost without losing alignment.</p>
                <div v-if="showScores" class="mt-3 pt-3 border-t border-default/50 flex flex-wrap items-start gap-4">
                  <MeetingScoreGauge :score="exampleScores[9].score" :size="100" />
                  <div class="flex flex-col gap-1 min-w-0">
                    <p class="text-muted text-sm italic">{{ exampleScores[9].text }}</p>
                    <ul v-if="exampleScores[9].factors.length" class="text-muted text-xs mt-1 list-disc pl-5">
                      <li v-for="f in exampleScores[9].factors" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
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
