<script setup lang="ts">
import type { Meeting } from '~/types'
import { formatCurrency, formatDate, formatDuration, formatTime } from '~/utils/formatting'
import { sanitizeString } from '~/utils/sanitize'

definePageMeta({
  layout: 'calculator',
})

const { meetings, clearHistory } = useMeetingHistory()

function sanitizedMeetingDescription(meeting: Meeting): string {
  return meeting.meetingDescription
    ? sanitizeString(meeting.meetingDescription, 200)
    : 'Meeting'
}
const { sectorLabels } = useMeetcostConfig()
const toast = useToast()
const expandedId = ref<string | null>(null)

function toggleExpanded(meeting: Meeting) {
  expandedId.value = expandedId.value === meeting.id ? null : meeting.id
}

function handleClearHistory() {
  const confirmed = window.confirm(
    'Are you sure you want to clear your meeting history? Once cleared, it cannot be recovered.'
  )
  if (!confirmed) return
  clearHistory()
  expandedId.value = null
  toast.add({ title: 'History cleared', color: 'success', icon: 'i-lucide-check' })
}
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-2xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        Meeting History
      </h1>
      <UButton
        v-if="meetings.length > 0"
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-lucide-trash-2"
        @click="handleClearHistory"
      >
        Clear history
      </UButton>
    </div>

    <ClientOnly>
      <div v-if="meetings.length === 0" class="text-muted py-12 text-center">
        <UIcon name="i-lucide-calendar-clock" class="size-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
        <p class="text-lg font-medium text-highlighted mb-2">
          No meetings yet
        </p>
        <p class="mb-6">
          Complete a meeting on the calculator to see it here.
        </p>
        <NuxtLink to="/calculate">
          <UButton color="primary" icon="i-lucide-plus">
            Start a meeting
          </UButton>
        </NuxtLink>
      </div>

      <ul v-else class="space-y-3">
        <li
          v-for="meeting of meetings"
          :key="meeting.id"
          class="bg-default border border-default rounded-lg overflow-hidden"
        >
          <button
            type="button"
            class="w-full px-4 py-4 text-left hover:bg-muted/30 transition-colors flex items-center justify-between gap-4"
            @click="toggleExpanded(meeting)"
          >
            <div class="flex-1 min-w-0">
              <p class="font-medium text-highlighted truncate">
                {{ sanitizedMeetingDescription(meeting) }}
              </p>
              <p class="text-sm text-muted">
                {{ formatDate(meeting.timestamp) }} • {{ formatTime(meeting.timestamp) }}
                <span v-if="meeting.sectorType" class="ml-2">
                  • {{ sectorLabels[meeting.sectorType] }}
                </span>
              </p>
            </div>
            <div class="flex items-center gap-4 shrink-0">
              <span class="text-sm text-muted">
                {{ formatDuration(meeting.duration).readable }}
              </span>
              <span class="font-bold text-error">
                {{ formatCurrency(meeting.totalCost) }}
              </span>
              <UIcon
                :name="expandedId === meeting.id ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="size-5 text-muted"
                aria-hidden="true"
              />
            </div>
          </button>

          <div
            v-show="expandedId === meeting.id"
            class="border-t border-default bg-muted/20"
          >
            <CalculatorReceipt :meeting="meeting" />
          </div>
        </li>
      </ul>

      <template #fallback>
        <div class="text-muted py-12 text-center">
          <p>Loading history…</p>
        </div>
      </template>
    </ClientOnly>

    <NuxtLink to="/" class="text-primary hover:underline font-medium mt-6 inline-block">
      ← Back to home
    </NuxtLink>
  </div>
</template>
