<script setup lang="ts">
import type { ShareReceiptPayload } from '~/composables/useShareReceipt'
import { formatCurrency, formatDate, formatTime } from '~/utils/formatting'
import { generateComparisonList } from '~/utils/comparisons'
import { useShareReceipt } from '~/composables/useShareReceipt'
import { useMeetingBurnConfig } from '~/composables/useMeetingBurnConfig'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const { decodeSharePayload } = useShareReceipt()
const { sectorLabels, receiptFooter } = useMeetingBurnConfig()

const payload = ref<ShareReceiptPayload | null>(null)
const error = ref<string | null>(null)

function formatDurationFromSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h} hour${h !== 1 ? 's' : ''} ${m} minute${m !== 1 ? 's' : ''}`
  if (m > 0) return `${m} minute${m !== 1 ? 's' : ''}`
  return `${s} second${s !== 1 ? 's' : ''}`
}

onMounted(() => {
  const r = route.query.r
  if (typeof r !== 'string') {
    error.value = 'No receipt data in URL'
    return
  }
  const decoded = decodeSharePayload(r)
  if (!decoded) {
    error.value = 'Invalid or corrupted receipt data'
    return
  }
  payload.value = decoded
})

const durationReadable = computed(() =>
  payload.value ? formatDurationFromSeconds(payload.value.d) : ''
)

const breakdownLines = computed(() => {
  if (!payload.value) return []
  const lines: string[] = []
  if (payload.value.f > 0) lines.push(`${payload.value.f} full-time employees`)
  if (payload.value.ct > 0) lines.push(`${payload.value.ct} contractors`)
  if (payload.value.un > 0) lines.push(`${payload.value.un} unknown/estimated`)
  return lines
})

const comparisons = computed(() =>
  payload.value ? generateComparisonList(payload.value.c) : []
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default">
    <main class="flex-1 container mx-auto px-4 py-12 max-w-2xl">
      <div v-if="error" class="text-center py-16">
        <p class="text-xl text-muted mb-4">{{ error }}</p>
        <NuxtLink to="/" class="text-primary hover:underline">
          Back to MeetingBurn
        </NuxtLink>
      </div>

      <div
        v-else-if="payload"
        class="bg-default border border-default rounded-lg p-6 shadow-sm"
      >
        <h1 class="text-2xl font-bold text-highlighted mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-receipt" class="size-7" aria-hidden="true" />
          Shared Meeting Receipt
        </h1>

        <div
          v-if="payload.s"
          class="mb-4 px-4 py-2 rounded-full text-sm font-semibold w-fit"
          :class="payload.s === 'public' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted'"
        >
          {{ sectorLabels[payload.s] }}
        </div>
        <p v-if="payload.m" class="text-lg font-medium text-highlighted mb-2">
          {{ payload.m }}
        </p>
        <p class="text-muted mb-6">
          {{ formatDate(payload.t) }} • {{ formatTime(payload.t) }}
        </p>

        <div class="space-y-4 mb-6">
          <div>
            <p class="text-sm font-medium text-muted">DURATION</p>
            <p class="text-xl font-bold">{{ durationReadable }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-muted">ATTENDEES</p>
            <p class="text-lg">{{ payload.n }} people</p>
            <ul v-if="breakdownLines.length" class="mt-1 text-muted list-disc list-inside">
              <li v-for="line in breakdownLines" :key="line">{{ line }}</li>
            </ul>
          </div>
          <div>
            <p class="text-sm font-medium text-muted">AVERAGE RATE</p>
            <p class="text-lg">{{ formatCurrency(payload.a) }}/hour</p>
          </div>
        </div>

        <div class="border-t border-default pt-6 mb-6">
          <p class="text-sm font-medium text-muted mb-1">TOTAL COST</p>
          <p class="text-4xl font-bold text-error">{{ formatCurrency(payload.c) }}</p>
        </div>

        <div v-if="comparisons.length" class="mb-6 p-4 bg-muted/30 rounded-lg">
          <p class="text-sm font-medium text-muted mb-2">This meeting cost the same as:</p>
          <ul class="list-disc list-inside text-muted">
            <li v-for="c in comparisons" :key="c">{{ c }}</li>
          </ul>
        </div>

        <p class="text-sm text-muted">
          <strong>If repeated weekly:</strong> Annual cost: {{ formatCurrency(payload.c * 52) }}
        </p>
        <p class="text-xs text-muted mt-6">{{ receiptFooter }}</p>
        <div class="mt-8">
          <NuxtLink to="/">
            <UButton color="primary" icon="i-lucide-plus">
              Track your own meetings
            </UButton>
          </NuxtLink>
        </div>
      </div>

      <div v-else class="text-center py-16 text-muted">
        Loading receipt…
      </div>
    </main>
  </div>
</template>
