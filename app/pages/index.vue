<script setup lang="ts">
const { tagline, defaultDescription, appName, siteUrl, salaryDataYear, salarySources } = useMeetingBurnConfig()
useSeoMeta({
  title: tagline,
  description: defaultDescription,
  ogImage: `${siteUrl}/og-image.png`,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="container mx-auto px-4 py-16 md:py-24">
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-4xl md:text-6xl font-bold text-highlighted mb-6">
        {{ tagline }}
      </h1>
      <p class="text-xl text-muted mb-10 max-w-2xl mx-auto">
        Transform abstract meeting time into concrete financial data. See the true cost of every minute—and share the shock.
      </p>

      <!-- Privacy-first: front and center -->
      <div class="mb-12 p-6 md:p-8 rounded-2xl bg-primary/5 border-2 border-primary/20 max-w-2xl mx-auto">
        <div class="flex items-center justify-center gap-3 mb-3">
          <div class="inline-flex p-2.5 rounded-full bg-primary/15 text-primary">
            <UIcon name="i-lucide-shield-check" class="size-8" aria-hidden="true" />
          </div>
          <h2 class="text-xl md:text-2xl font-bold text-highlighted">
            Privacy-first
          </h2>
        </div>
        <p class="text-base md:text-lg font-semibold text-highlighted mb-2">
          Nothing leaves your browser. All data stays with you.
        </p>
        <p class="text-sm md:text-base text-muted">
          All calculation and tracking runs entirely in your browser. No tracking, no servers, no accounts—your data never leaves your device. Zero privacy concerns.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/calculate">
          <UButton
            size="xl"
            color="primary"
            class="min-h-[56px] w-full sm:w-auto px-8 text-lg font-semibold"
            icon="i-lucide-flame"
            aria-label="Start Tracking Now"
          >
            Start Tracking Now
          </UButton>
        </NuxtLink>
        <NuxtLink to="/about">
          <UButton
            size="xl"
            color="neutral"
            variant="outline"
            class="min-h-[56px] w-full sm:w-auto px-8 text-lg"
            :aria-label="`About ${appName}`"
          >
            About {{ appName }}
          </UButton>
        </NuxtLink>
      </div>

      <div class="mt-10 p-6 rounded-xl bg-muted/30 border border-default max-w-2xl mx-auto">
        <p class="text-base md:text-lg font-medium text-highlighted mb-2">
          Free forever. No login required.
        </p>
        <p class="text-sm md:text-base text-muted">
          {{ appName }} is 100% free and will always be free. No accounts, no sign-ups.
        </p>
      </div>

      <div class="mt-6 p-6 rounded-xl bg-muted/30 border border-default max-w-2xl mx-auto">
        <p class="text-base md:text-lg font-medium text-highlighted mb-2">
          Not random guesses—documented salary data
        </p>
        <p class="text-sm md:text-base text-muted mb-3">
          Average costs use {{ salaryDataYear }} US market data from trusted sources:
          <span v-for="(src, i) in salarySources" :key="src.name" class="inline">
            <a :href="src.url" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">{{ src.name }}</a><template v-if="i < salarySources.length - 1">, </template>
          </span>.
        </p>
        <NuxtLink to="/about#salary-sources" class="text-sm font-medium text-primary hover:underline">
          See how average salary costs are calculated →
        </NuxtLink>
      </div>
    </div>

    <div class="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <!-- Privacy-first first - critical differentiator -->
      <NuxtLink
        to="/about#privacy"
        class="text-center p-6 rounded-lg border-2 border-primary/20 md:order-1 transition-all hover:shadow-lg hover:scale-105 hover:border-primary/40 cursor-pointer group"
      >
        <div class="inline-flex p-3 rounded-full bg-primary/15 text-primary mb-4 group-hover:bg-primary/25 transition-colors">
          <UIcon name="i-lucide-shield-check" class="size-8" aria-hidden="true" />
        </div>
        <h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Privacy-first</h3>
        <p class="text-muted text-sm">
          Nothing leaves your browser. All data stored locally. No tracking, no servers.
        </p>
      </NuxtLink>
      <NuxtLink
        to="/about#how-it-works"
        class="text-center p-6 rounded-lg border border-default md:order-2 transition-all hover:shadow-lg hover:scale-105 hover:border-primary/30 cursor-pointer group"
      >
        <div class="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
          <UIcon name="i-lucide-clock" class="size-8" aria-hidden="true" />
        </div>
        <h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Live counter</h3>
        <p class="text-muted text-sm">
          See costs tick up every second. No more guessing—just the numbers.
        </p>
      </NuxtLink>
      <NuxtLink
        to="/about#sharing"
        class="text-center p-6 rounded-lg border border-default md:order-3 transition-all hover:shadow-lg hover:scale-105 hover:border-primary/30 cursor-pointer group"
      >
        <div class="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
          <UIcon name="i-lucide-share-2" class="size-8" aria-hidden="true" />
        </div>
        <h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Shareable receipts</h3>
        <p class="text-muted text-sm">
          Copy as Markdown or plain text. Share the shock with your team.
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
