<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { formatCurrency, formatElapsedTime } from '~/utils/formatting'

function formatCostPerSecond(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value)
}
import type { Participant, SectorType } from '~/types'
import { getCostPerSecond } from '~/utils/calculations'

const props = defineProps<{
  participants: Participant[]
  sectorType: SectorType
  isRunning: boolean
  isPaused: boolean
  startTime: number
}>()

const { sectorLabels } = useMeetcostConfig()
const sectorLabel = computed(() => sectorLabels[props.sectorType])

const emit = defineEmits<{
  stop: []
  pause: []
  resume: []
}>()

const costPerSecond = computed(() => getCostPerSecond(props.participants))

const elapsedSeconds = ref(0)
const pausedAtSeconds = ref<number | null>(null)

const displaySeconds = computed(() => {
  if (props.isPaused && pausedAtSeconds.value !== null) {
    return pausedAtSeconds.value
  }
  return elapsedSeconds.value
})

const currentCost = computed(() => {
  return costPerSecond.value * displaySeconds.value
})

const costThresholdClass = computed(() => {
  const cost = currentCost.value
  if (cost <= 500) return 'text-success'
  if (cost <= 2000) return 'text-warning'
  return 'text-error'
})

useIntervalFn(
  () => {
    if (!props.isRunning || props.isPaused) return
    elapsedSeconds.value = Math.floor((Date.now() - props.startTime) / 1000)
  },
  1000,
  { immediate: true }
)

watch(
  () => props.isPaused,
  (paused) => {
    if (paused) {
      pausedAtSeconds.value = elapsedSeconds.value
    } else {
      pausedAtSeconds.value = null
    }
  }
)

watch(
  () => props.startTime,
  () => {
    elapsedSeconds.value = 0
    pausedAtSeconds.value = null
  }
)

function onPause() {
  emit('pause')
}

function onResume() {
  emit('resume')
}

function onStop() {
  emit('stop')
}

const startTimeFormatted = computed(() => {
  return new Date(props.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
})
</script>

<template>
  <div class="flex flex-col items-center justify-center flex-1 py-8 px-4" role="region" aria-live="polite" aria-label="Meeting cost counter">
    <div
      class="mb-4 px-4 py-2 rounded-full text-sm font-semibold"
      :class="sectorType === 'public' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted'"
    >
      {{ sectorLabel }}
    </div>
    <p class="text-2xl md:text-3xl font-bold text-muted mb-4">
      MEETING IN PROGRESS
    </p>

    <p
      class="text-6xl md:text-9xl font-extrabold tabular-nums transition-colors duration-300"
      :class="costThresholdClass"
      data-test="cost-display"
    >
      {{ formatCurrency(currentCost) }}
    </p>

    <p class="text-2xl md:text-4xl font-bold text-muted mt-4">
      +{{ formatCostPerSecond(costPerSecond) }} per second
    </p>

    <div class="mt-8 flex flex-col items-center gap-2 text-xl text-muted font-medium">
      <span class="flex items-center gap-2">
        <UIcon name="i-lucide-clock" class="size-5" aria-hidden="true" />
        {{ formatElapsedTime(displaySeconds) }} elapsed
      </span>
      <span class="flex items-center gap-2">
        <UIcon name="i-lucide-calendar" class="size-5" aria-hidden="true" />
        Started at {{ startTimeFormatted }}
      </span>
    </div>

    <div class="mt-8 flex flex-wrap gap-4 justify-center">
      <UButton
        v-if="!isPaused"
        size="xl"
        color="neutral"
        variant="outline"
        class="min-h-[52px]"
        icon="i-lucide-pause"
        aria-label="Pause meeting"
        @click="onPause"
      >
        Pause
      </UButton>
      <UButton
        v-else
        size="xl"
        color="primary"
        variant="solid"
        class="min-h-[52px]"
        icon="i-lucide-play"
        aria-label="Resume meeting"
        @click="onResume"
      >
        Resume
      </UButton>
      <UButton
        size="xl"
        color="error"
        variant="solid"
        class="min-h-[52px]"
        icon="i-lucide-square"
        aria-label="Stop meeting"
        @click="onStop"
      >
        Stop
      </UButton>
    </div>
  </div>
</template>
