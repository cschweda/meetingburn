<script setup lang="ts">
const { appName, receiptFooter } = useMeetingBurnConfig()

function scrollToTop() {
  if (import.meta.client) window.scrollTo(0, 0)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default w-full min-w-0">
    <header class="border-b border-default shrink-0 overflow-visible">
      <div class="container mx-auto px-4 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <NuxtLink
          to="/"
          class="hover:opacity-80 transition-opacity shrink-0 overflow-visible"
          @click="scrollToTop"
        >
          <span class="text-4xl sm:text-6xl md:text-8xl font-bold font-sans text-primary tracking-tight block leading-[1.1] pb-1">
            {{ appName }}
          </span>
        </NuxtLink>
        <nav class="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0" role="navigation" aria-label="Main navigation">
          <NuxtLink
            to="/"
            class="text-sm font-medium text-muted hover:text-highlighted transition-colors"
            @click="scrollToTop"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/calculate"
            class="text-sm font-medium text-muted hover:text-highlighted transition-colors"
          >
            Calculator
          </NuxtLink>
          <NuxtLink
            to="/history"
            class="text-sm font-medium text-muted hover:text-highlighted transition-colors"
          >
            History
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-sm font-medium text-muted hover:text-highlighted transition-colors"
          >
            About
          </NuxtLink>
          <ClientOnly>
            <UColorModeButton aria-label="Toggle color mode" />
            <template #fallback>
              <span class="size-9" aria-hidden="true" />
            </template>
          </ClientOnly>
        </nav>
      </div>
    </header>
    <main class="flex-1 min-w-0 w-full overflow-x-hidden">
      <slot />
    </main>
    <footer class="border-t border-default py-6 text-center text-sm text-muted">
      <p>{{ receiptFooter }}</p>
    </footer>
  </div>
</template>
