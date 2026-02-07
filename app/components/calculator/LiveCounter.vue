<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { formatCurrency, formatElapsedTime, formatHourlyRate } from '~/utils/formatting'

function formatCostPerSecond(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value)
}
import type { Participant, SectorType } from '~/types'
import { getAverageHourlyRate, getCostPerSecond } from '~/utils/calculations'

const props = withDefaults(
  defineProps<{
    participants: Participant[]
    sectorType: SectorType
    meetingType?: string
    isRunning: boolean
    isPaused: boolean
    startTime: number
  }>(),
  { meetingType: 'General' }
)

const { sectorLabels } = useMeetcostConfig()
const sectorLabel = computed(() => sectorLabels[props.sectorType])

const emit = defineEmits<{
  stop: []
  pause: []
  resume: []
  milestone: [amount: number]
}>()

const MILESTONES = [500, 1000, 5000, 10000]
const reachedMilestones = ref<Set<number>>(new Set())

const costPerSecond = computed(() => getCostPerSecond(props.participants))

const activeParticipantCount = computed(() =>
  props.participants.filter((p) => p.isActive).length
)

const averageHourlyRate = computed(() => getAverageHourlyRate(props.participants))

const averageHourlyRateDisplay = computed(() => {
  const rate = averageHourlyRate.value
  return rate !== null ? formatHourlyRate(rate) : '—'
})

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
    reachedMilestones.value = new Set()
  }
)

watch(currentCost, (cost) => {
  if (!props.isRunning || props.isPaused) return
  for (const m of MILESTONES) {
    if (cost >= m && !reachedMilestones.value.has(m)) {
      reachedMilestones.value = new Set([...reachedMilestones.value, m])
      emit('milestone', m)
    }
  }
})

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
        <UIcon name="i-lucide-layout-list" class="size-5" aria-hidden="true" />
        {{ meetingType }}
      </span>
      <span class="flex items-center gap-2">
        <UIcon name="i-lucide-users" class="size-5" aria-hidden="true" />
        {{ activeParticipantCount }} {{ activeParticipantCount === 1 ? 'participant' : 'participants' }}
      </span>
      <span class="flex items-center gap-2 flex-wrap justify-center" data-test="avg-hourly-rate">
        <UIcon name="i-lucide-dollar-sign" class="size-5 shrink-0" aria-hidden="true" />
        <span>Avg. {{ averageHourlyRateDisplay }}</span>
        <ClientOnly>
          <UPopover :content="{ side: 'top', align: 'center', sideOffset: 8 }">
            <UButton
              variant="soft"
              color="neutral"
              size="sm"
              icon="i-lucide-info"
              aria-label="Learn more about average hourly rate"
              class="shrink-0"
            >
              Learn more
            </UButton>
            <template #content>
              <div class="p-4 max-w-sm text-sm space-y-2 bg-muted/90 dark:bg-muted/80 rounded-lg shadow-lg ring-1 ring-default">
                <p class="font-semibold text-foreground">
                  Average hourly rate
                </p>
                <p class="text-muted">
                  This is the average cost per hour across all participants, based on their salaries or hourly rates. For full-time employees, annual salary is converted to hourly (salary ÷ 2,080 working hours per year).
                </p>
                <p class="text-muted">
                  The meeting cost above is the sum of all participants' hourly rates × elapsed time.
                </p>
              </div>
            </template>
          </UPopover>
          <template #fallback>
            <span class="opacity-70 text-sm">(Learn more)</span>
          </template>
        </ClientOnly>
      </span>
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
