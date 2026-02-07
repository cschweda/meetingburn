<script setup lang="ts">
const { appName } = useMeetcostConfig()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default">
    <header class="border-b border-default">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink
          to="/"
          class="hover:opacity-80 transition-opacity"
          :aria-label="`Back to ${appName} home`"
          @click="() => { if (typeof window !== 'undefined') window.scrollTo(0, 0) }"
        >
          <span class="text-6xl md:text-8xl font-bold font-sans text-primary tracking-tight block">
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
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
