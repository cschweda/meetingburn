<script setup lang="ts">
const { tagline, defaultDescription, appName } = useMeetcostConfig()
useSeoMeta({
  title: `${appName} - ${tagline}`,
  description: defaultDescription,
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
    </div>

    <div class="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <!-- Privacy-first first - critical differentiator -->
      <div class="text-center p-6 rounded-lg border-2 border-primary/20 md:order-1">
        <div class="inline-flex p-3 rounded-full bg-primary/15 text-primary mb-4">
          <UIcon name="i-lucide-shield-check" class="size-8" aria-hidden="true" />
        </div>
        <h3 class="text-lg font-semibold mb-2">Privacy-first</h3>
        <p class="text-muted text-sm">
          Nothing leaves your browser. All data stored locally. No tracking, no servers.
        </p>
      </div>
      <div class="text-center p-6 rounded-lg border border-default md:order-2">
        <div class="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
          <UIcon name="i-lucide-clock" class="size-8" aria-hidden="true" />
        </div>
        <h3 class="text-lg font-semibold mb-2">Live counter</h3>
        <p class="text-muted text-sm">
          See costs tick up every second. No more guessing—just the numbers.
        </p>
      </div>
      <div class="text-center p-6 rounded-lg border border-default md:order-3">
        <div class="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
          <UIcon name="i-lucide-share-2" class="size-8" aria-hidden="true" />
        </div>
        <h3 class="text-lg font-semibold mb-2">Shareable receipts</h3>
        <p class="text-muted text-sm">
          Copy as Markdown or plain text. Share the shock with your team.
        </p>
      </div>
    </div>
  </div>
</template>
