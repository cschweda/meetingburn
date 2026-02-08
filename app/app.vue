<template>
  <div class="min-w-0 w-full overflow-x-hidden">
    <UApp>
      <NuxtLayout>
      <NuxtErrorBoundary>
        <NuxtPage />
        <template #error="{ error, clearError }">
          <div class="min-h-[40vh] flex flex-col items-center justify-center px-4">
            <p class="text-lg font-medium text-highlighted mb-2">Something went wrong</p>
            <p class="text-sm text-muted mb-6 max-w-md text-center">{{ error?.message ?? 'An unexpected error occurred.' }}</p>
            <UButton color="primary" icon="i-lucide-refresh-cw" @click="clearError()">
              Try again
            </UButton>
          </div>
        </template>
      </NuxtErrorBoundary>
    </NuxtLayout>
    </UApp>
  </div>
</template>
