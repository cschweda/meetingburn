<script setup lang="ts">
const error = useError()
const route = useRoute()
const { appName } = useMeetcostConfig()

const statusCode = computed(() => error.value?.statusCode ?? 500)
const message = computed(() => {
  const msg = error.value?.message
  if (msg && msg !== error.value?.statusMessage) return msg
  if (statusCode.value === 404) return 'This page could not be found.'
  return 'Something went wrong. Please try again.'
})

function retry() {
  clearError({ redirect: route.path })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default">
    <header class="border-b border-default">
      <div class="container mx-auto px-4 py-3">
        <NuxtLink to="/" class="text-primary font-bold hover:opacity-80 transition-opacity">
          {{ appName }}
        </NuxtLink>
      </div>
    </header>
    <main class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="max-w-md w-full text-center">
        <p class="text-6xl font-bold text-muted mb-4" aria-hidden="true">
          {{ statusCode }}
        </p>
        <h1 class="text-2xl font-bold text-highlighted mb-4">
          {{ statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
        </h1>
        <p class="text-muted mb-8">
          {{ message }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            size="lg"
            color="primary"
            icon="i-lucide-home"
            @click="clearError({ redirect: '/' })"
          >
            Back to home
          </UButton>
          <UButton
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-lucide-refresh-cw"
            @click="retry"
          >
            Try again
          </UButton>
        </div>
      </div>
    </main>
  </div>
</template>
