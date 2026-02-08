<script setup lang="ts">
const { appName } = useMeetingBurnConfig()

function scrollToTop() {
  if (import.meta.client) window.scrollTo(0, 0)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default w-full min-w-0">
    <header class="border-b border-default shrink-0 overflow-visible">
      <div class="container mx-auto px-4 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <NuxtLink
          to="/"
          class="hover:opacity-80 transition-opacity shrink-0 overflow-visible"
          :aria-label="`Back to ${appName} home`"
          @click="scrollToTop"
        >
          <span class="text-4xl sm:text-6xl md:text-8xl font-bold font-sans text-primary tracking-tight block leading-[1.1] pb-1">
            {{ appName }}
          </span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <ClientOnly>
            <UColorModeButton aria-label="Toggle color mode" />
            <template #fallback>
              <span class="size-9" aria-hidden="true" />
            </template>
          </ClientOnly>
          <NuxtLink
            to="/"
            class="text-sm font-medium text-muted hover:text-highlighted transition-colors"
          >
            Home
          </NuxtLink>
        </div>
      </div>
    </header>
    <main class="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
      <slot />
    </main>
  </div>
</template>
