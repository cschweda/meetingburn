<script setup lang="ts">
const { appName, receiptFooter } = useMeetcostConfig()

function scrollToTop() {
  if (import.meta.client) window.scrollTo(0, 0)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default">
    <header class="border-b border-default">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink
          to="/"
          class="hover:opacity-80 transition-opacity"
          @click="scrollToTop"
        >
          <span class="text-6xl md:text-8xl font-bold font-sans text-primary tracking-tight block">
            {{ appName }}
          </span>
        </NuxtLink>
        <nav class="flex items-center gap-4" role="navigation" aria-label="Main navigation">
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
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-default py-6 text-center text-sm text-muted">
      <p>{{ receiptFooter }}</p>
    </footer>
  </div>
</template>
