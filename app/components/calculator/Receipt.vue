<script setup lang="ts">
import type { Meeting } from '~/types'
import { formatCurrency, formatDate, formatDuration, formatTime } from '~/utils/formatting'
import { generateComparisonList } from '~/utils/comparisons'
import { useReceipt } from '~/composables/useReceipt'
import { useCalculator } from '~/composables/useCalculator'
import { useMeetingHistory } from '~/composables/useMeetingHistory'
import { useShareReceipt } from '~/composables/useShareReceipt'
import { usePresets } from '~/composables/usePresets'
import { useMeetingScore } from '~/composables/useMeetingScore'
import { sanitizeString } from '~/utils/sanitize'

const { PRESETS } = usePresets()
const { computeMeetingScore } = useMeetingScore()

const props = defineProps<{
  meeting: Meeting
  showComparison?: boolean
  showBreakdown?: boolean
}>()

const emit = defineEmits<{
  'update:meeting': [meeting: Meeting]
  'update:preview': [payload: { meetingId: string; durationSeconds: number; totalCost: number } | null]
}>()

const { buildMeeting } = useCalculator()
const { updateMeeting } = useMeetingHistory()

const showComparison = computed(() => props.showComparison ?? true)
const showBreakdown = computed(() => props.showBreakdown ?? true)

const sanitizedMeetingDescription = computed(() =>
  props.meeting.meetingDescription ? sanitizeString(props.meeting.meetingDescription, 200) : ''
)

const presetLabel = computed(() => {
  const pt = props.meeting.preset
  if (!pt || pt === 'custom') return undefined
  return PRESETS[pt]?.label
})

const {
  generateMarkdown,
  generatePlainText,
  generateCSV,
  generatePDF,
  generatePNG,
  downloadFile,
  copyToClipboard,
  getParticipantBreakdown,
} = useReceipt()

const { getShareUrl, shareNative } = useShareReceipt()

const { receiptFooter } = useMeetingBurnConfig()
const toast = useToast()
const copySuccess = ref<'markdown' | 'plain' | null>(null)
const showScore = ref(false)

const showAdjustDuration = ref(false)
const adjustHours = ref(0)
const adjustMinutes = ref(0)
const adjustSeconds = ref(0)
const adjustContainerRef = ref<HTMLElement | null>(null)

function openAdjustDuration() {
  const d = props.meeting.duration
  adjustHours.value = Math.floor(d / 3600)
  adjustMinutes.value = Math.floor((d % 3600) / 60)
  adjustSeconds.value = d % 60
  showAdjustDuration.value = true
}

function applyDurationAdjustment() {
  const newDurationSeconds = Math.max(0, adjustHours.value * 3600 + adjustMinutes.value * 60 + adjustSeconds.value)
  const updated = buildMeeting(
    props.meeting.participants,
    newDurationSeconds,
    props.meeting.timestamp,
    undefined,
    props.meeting.meetingDescription,
    props.meeting.preset,
    props.meeting.format,
    props.meeting.format === 'in-person' && (props.meeting.inPersonCost ?? 0) > 0,
    props.meeting.commuteMinutesPerPerson,
    props.meeting.inPersonExtrasPerPerson
  )
  updated.id = props.meeting.id
  updateMeeting(props.meeting.id, updated)
  emit('update:meeting', updated)
  emit('update:preview', null)
  showAdjustDuration.value = false
  toast.add({ title: 'Duration updated', color: 'success', icon: 'i-lucide-check' })
}

function onAdjustFocusOut(e: FocusEvent) {
  if (!showAdjustDuration.value) return
  const container = adjustContainerRef.value
  if (!container) return
  const next = e.relatedTarget as Node | null
  if (next && container.contains(next)) return
  applyDurationAdjustment()
}

const adjustedDurationSeconds = computed(() =>
  Math.max(0, adjustHours.value * 3600 + adjustMinutes.value * 60 + adjustSeconds.value)
)

const displayDuration = computed(() =>
  showAdjustDuration.value
    ? formatDuration(adjustedDurationSeconds.value)
    : formatDuration(props.meeting.duration)
)

const baseMeetingCost = computed(() =>
  showAdjustDuration.value
    ? props.meeting.costPerSecond * adjustedDurationSeconds.value
    : (props.meeting.meetingCost ?? props.meeting.totalCost)
)

const displayInPersonCost = computed(() =>
  props.meeting.inPersonCost ?? 0
)

const inPersonCostPerPerson = computed(() => {
  const total = displayInPersonCost.value
  const n = props.meeting.participants?.length || 1
  return total / n
})

const displayTotalCost = computed(() =>
  baseMeetingCost.value + displayInPersonCost.value
)

watch(
  [showAdjustDuration, adjustedDurationSeconds, displayTotalCost],
  () => {
    if (showAdjustDuration.value) {
      emit('update:preview', {
        meetingId: props.meeting.id,
        durationSeconds: adjustedDurationSeconds.value,
        totalCost: displayTotalCost.value,
      })
    }
  },
  { immediate: true }
)

const duration = computed(() => formatDuration(props.meeting.duration))
const breakdown = computed(() => getParticipantBreakdown(props.meeting.participants))
const comparisons = computed(() => generateComparisonList(displayTotalCost.value))

const breakdownLines = computed(() => {
  const lines: string[] = []
  if (breakdown.value.fulltime > 0) lines.push(`${breakdown.value.fulltime} full-time employees`)
  if (breakdown.value.contractor > 0) lines.push(`${breakdown.value.contractor} contractors`)
  if (breakdown.value.unknown > 0) lines.push(`${breakdown.value.unknown} unknown/estimated`)
  return lines
})

const displayDurationSeconds = computed(() =>
  showAdjustDuration.value ? adjustedDurationSeconds.value : props.meeting.duration
)

const meetingScore = computed(() =>
  computeMeetingScore({
    totalCost: displayTotalCost.value,
    format: props.meeting.format ?? 'remote',
    meetingType: props.meeting.meetingDescription,
    durationSeconds: displayDurationSeconds.value,
    participantCount: props.meeting.participants.length,
    inPersonCost: displayInPersonCost.value,
  })
)

const timestamp = computed(() =>
  new Date(props.meeting.timestamp).toISOString().replace(/[:.]/g, '-').slice(0, 19)
)

function showCopySuccess(type: 'markdown' | 'plain') {
  copySuccess.value = type
  toast.add({ title: `Copied as ${type === 'markdown' ? 'Markdown' : 'plain text'}`, color: 'success', icon: 'i-lucide-check' })
  setTimeout(() => {
    copySuccess.value = null
  }, 2000)
}

async function copyAsMarkdown() {
  const success = await copyToClipboard(generateMarkdown(props.meeting))
  if (success) showCopySuccess('markdown')
  else toast.add({ title: 'Failed to copy', color: 'error' })
}

async function copyAsPlainText() {
  const success = await copyToClipboard(generatePlainText(props.meeting))
  if (success) showCopySuccess('plain')
  else toast.add({ title: 'Failed to copy', color: 'error' })
}

function downloadMarkdown() {
  downloadFile(generateMarkdown(props.meeting), `meeting-receipt-${timestamp.value}.md`, 'text/markdown;charset=utf-8')
  toast.add({ title: 'Downloaded Markdown', color: 'success' })
}

function downloadPlainText() {
  downloadFile(generatePlainText(props.meeting), `meeting-receipt-${timestamp.value}.txt`, 'text/plain;charset=utf-8')
  toast.add({ title: 'Downloaded TXT', color: 'success' })
}

function downloadCSV() {
  downloadFile(generateCSV(props.meeting), `meeting-receipt-${timestamp.value}.csv`, 'text/csv;charset=utf-8')
  toast.add({ title: 'Downloaded CSV', color: 'success' })
}

async function downloadPDF() {
  const blob = await generatePDF(props.meeting)
  downloadFile(blob, `meeting-receipt-${timestamp.value}.pdf`, 'application/pdf')
  toast.add({ title: 'Downloaded PDF', color: 'success' })
}

async function downloadPNG() {
  const blob = await generatePNG(props.meeting)
  downloadFile(blob, `meeting-receipt-${timestamp.value}.png`, 'image/png')
  toast.add({ title: 'Downloaded PNG', color: 'success' })
}

const shareSuccess = ref(false)

async function handleShare() {
  try {
    const text = generatePlainText(props.meeting)
    let pngBlob: Blob | undefined
    try {
      pngBlob = await generatePNG(props.meeting)
    } catch {
      // Skip PNG if canvas fails
    }
    const success = await shareNative(props.meeting, text, pngBlob)
    if (success) {
      shareSuccess.value = true
      toast.add({ title: 'Shared successfully', color: 'success', icon: 'i-lucide-share-2' })
      setTimeout(() => { shareSuccess.value = false }, 2000)
    }
  } catch (e) {
    if ((e as Error).name !== 'AbortError') {
      await copyShareLink()
    }
  }
}

async function copyShareLink() {
  const url = getShareUrl(props.meeting)
  const success = await copyToClipboard(url)
  if (success) {
    toast.add({ title: 'Share link copied to clipboard', color: 'success', icon: 'i-lucide-link' })
  } else {
    toast.add({ title: 'Failed to copy link', color: 'error' })
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-6 w-full min-w-0" data-test="receipt">
    <div class="bg-default border border-default rounded-lg p-4 sm:p-6 shadow-sm">
      <h2 class="text-2xl font-bold text-highlighted mb-4 flex items-center gap-2">
        <UIcon name="i-lucide-receipt" class="size-7" aria-hidden="true" />
        Meeting Receipt
      </h2>

      <p v-if="presetLabel" class="text-sm font-medium text-muted mb-1">
        {{ presetLabel }}
      </p>
      <p v-if="meeting.format" class="text-sm font-medium text-muted mb-1">
        {{ meeting.format === 'in-person' ? 'In-person' : 'Remote' }}
      </p>
      <p v-if="sanitizedMeetingDescription" class="text-lg font-medium text-highlighted mb-2">
        {{ sanitizedMeetingDescription }}
      </p>
      <p class="text-muted mb-6">
        {{ formatDate(meeting.timestamp) }} • {{ formatTime(meeting.timestamp) }}
      </p>

      <div class="space-y-4 mb-6">
        <div>
          <p class="text-sm font-medium text-muted">DURATION</p>
          <p class="text-xl font-bold">
            {{ displayDuration.readable }}
            <span class="text-base font-normal text-muted">
              ({{ displayDuration.totalSeconds >= 60
                ? displayDuration.totalMinutes + ' minute' + (displayDuration.totalMinutes !== 1 ? 's' : '')
                : displayDuration.totalSeconds + ' second' + (displayDuration.totalSeconds !== 1 ? 's' : '')
              }})
            </span>
          </p>
          <div class="mt-2">
            <button
              v-if="!showAdjustDuration"
              type="button"
              class="text-xs text-muted hover:text-highlighted underline underline-offset-2"
              @click="openAdjustDuration"
            >
              Forgot to stop? Adjust duration
            </button>
            <div
              v-else
              ref="adjustContainerRef"
              class="mt-2 flex flex-wrap items-center gap-2"
              @focusout="onAdjustFocusOut"
            >
              <UInputNumber
                v-model="adjustHours"
                placeholder="Hr"
                :min="0"
                :max="99"
                size="sm"
                class="w-20"
                aria-label="Hours"
              />
              <span class="text-sm text-muted">hr</span>
              <UInputNumber
                v-model="adjustMinutes"
                placeholder="Min"
                :min="0"
                :max="59"
                size="sm"
                class="w-20"
                aria-label="Minutes"
              />
              <span class="text-sm text-muted">min</span>
              <UInputNumber
                v-model="adjustSeconds"
                placeholder="Sec"
                :min="0"
                :max="59"
                size="sm"
                class="w-20"
                aria-label="Seconds"
              />
              <span class="text-sm text-muted">sec</span>
              <UButton size="sm" color="primary" variant="soft" @click="applyDurationAdjustment">
                Apply
              </UButton>
              <UButton
                size="sm"
                color="neutral"
                variant="ghost"
                @click="() => { emit('update:preview', null); showAdjustDuration = false }"
              >
                Cancel
              </UButton>
            </div>
          </div>
        </div>

        <div>
          <p class="text-sm font-medium text-muted">ATTENDEES</p>
          <p class="text-lg">
            {{ meeting.participants.length }} people
          </p>
          <ul v-if="showBreakdown && breakdownLines.length" class="mt-1 text-muted list-disc list-inside">
            <li v-for="line in breakdownLines" :key="line">
              {{ line }}
            </li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-medium text-muted">AVERAGE RATE</p>
          <p class="text-lg">
            {{ formatCurrency(meeting.averageRate) }}/hour
          </p>
          <p class="text-xs text-muted mt-1">
            Sum of each participant's hourly rate ÷ number of participants. Full-time: salary ÷ 2,080 hrs/yr (40 hrs/week × 52 weeks). Contractor: hourly rate.
          </p>
        </div>
      </div>

      <div class="border-t border-default pt-6 mb-6">
        <p class="text-sm font-medium text-muted mb-1">TOTAL COST</p>
        <p class="text-4xl font-bold text-error">
          {{ formatCurrency(displayTotalCost) }}
        </p>
        <div v-if="displayInPersonCost > 0" class="mt-2 text-sm space-y-1">
          <p class="text-muted"><strong class="text-foreground">Company pays:</strong> {{ formatCurrency(baseMeetingCost) }} (meeting time)</p>
          <p class="text-muted"><strong class="text-foreground">Each employee pays (avg):</strong> {{ formatCurrency(inPersonCostPerPerson) }} (commute, coffee, parking, etc.—not exact; costs vary per person)</p>
          <p class="text-muted"><strong class="text-foreground">All employees together pay:</strong> {{ formatCurrency(displayInPersonCost) }}</p>
        </div>
        <p v-else class="text-xs text-muted mt-1">
          (Sum of hourly rates × duration in seconds) ÷ 3,600 sec/hr
        </p>
      </div>

      <div v-if="showComparison && comparisons.length" class="mb-6 p-4 bg-muted/30 rounded-lg">
        <p class="text-sm font-medium text-muted mb-2">This meeting cost the same as:</p>
        <ul class="list-disc list-inside text-muted">
          <li v-for="c in comparisons" :key="c">{{ c }}</li>
        </ul>
      </div>

      <div class="mb-6 text-sm text-muted">
        <p><strong>If repeated weekly:</strong> Annual cost: {{ formatCurrency(displayTotalCost * 52) }}</p>
        <p class="mt-1">
          Per-minute: {{ formatCurrency(meeting.costPerMinute) }}/min •
          Per-second: {{ formatCurrency(meeting.costPerSecond) }}/sec
        </p>
      </div>

      <div class="mb-6">
        <div v-if="!showScore">
          <button
            type="button"
            class="text-sm text-muted hover:text-highlighted underline underline-offset-2 flex items-center gap-2"
            @click="showScore = true"
          >
            <UIcon name="i-lucide-gauge" class="size-4" aria-hidden="true" />
            Show meeting score
          </button>
        </div>
        <div
          v-else
          class="p-4 rounded-lg border border-default bg-muted/20"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-muted">Meeting score</p>
            <button
              type="button"
              class="text-xs text-muted hover:text-highlighted underline underline-offset-2"
              @click="showScore = false"
            >
              Hide
            </button>
          </div>
          <div class="flex flex-wrap items-start gap-6">
            <MeetingScoreGauge :score="meetingScore.score" :size="140" />
            <div class="flex flex-col gap-2 min-w-0 flex-1">
              <p class="text-sm text-muted italic">
                {{ meetingScore.text }}
              </p>
              <div v-if="meetingScore.factors.length" class="mt-1">
                <p class="text-xs font-medium text-muted mb-1.5">What affected this score:</p>
                <ul class="text-xs text-muted list-disc list-inside space-y-0.5">
                  <li v-for="factor in meetingScore.factors" :key="factor">
                    {{ factor }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p class="text-xs text-muted mt-3">
            Subjective. Based on format, meeting type, and duration. For in-person meetings, considers actual expenses beyond salary (commute, parking, etc.). For remote meetings, only time/salary is considered—not treated as an expense.
          </p>
        </div>
      </div>

      <p class="text-xs text-muted mb-6">
        {{ receiptFooter }}
      </p>

      <div class="space-y-6">
        <div>
          <p class="text-sm font-medium text-muted mb-3">Download</p>
          <div class="flex flex-wrap gap-3">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="min-h-[48px]"
              icon="i-lucide-file-down"
              @click="downloadMarkdown"
            >
              Markdown
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="min-h-[48px]"
              icon="i-lucide-file-down"
              @click="downloadPlainText"
            >
              TXT
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="min-h-[48px]"
              icon="i-lucide-file-down"
              @click="downloadCSV"
            >
              CSV
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="min-h-[48px]"
              icon="i-lucide-file-down"
              @click="downloadPDF"
            >
              PDF
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="min-h-[48px]"
              icon="i-lucide-image"
              @click="downloadPNG"
            >
              PNG
            </UButton>
          </div>
        </div>
        <div>
          <p class="text-sm font-medium text-muted mb-3">Share</p>
          <div class="flex flex-wrap gap-3">
            <UButton
              :color="shareSuccess ? 'success' : 'primary'"
              :variant="shareSuccess ? 'soft' : 'solid'"
              size="lg"
              class="min-h-[48px]"
              :icon="shareSuccess ? 'i-lucide-check' : 'i-lucide-share-2'"
              @click="handleShare"
            >
              {{ shareSuccess ? 'Shared!' : 'Share via...' }}
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="min-h-[48px]"
              icon="i-lucide-link"
              @click="copyShareLink"
            >
              Copy share link
            </UButton>
          </div>
        </div>
        <div>
          <p class="text-sm font-medium text-muted mb-3">Copy to clipboard</p>
          <div class="flex flex-wrap gap-3">
            <UButton
              :color="copySuccess === 'markdown' ? 'success' : 'neutral'"
              :variant="copySuccess === 'markdown' ? 'soft' : 'outline'"
              size="lg"
              class="min-h-[48px]"
              :icon="copySuccess === 'markdown' ? 'i-lucide-check' : 'i-lucide-copy'"
              @click="copyAsMarkdown"
            >
              {{ copySuccess === 'markdown' ? 'Copied!' : 'Copy as Markdown' }}
            </UButton>
            <UButton
              :color="copySuccess === 'plain' ? 'success' : 'neutral'"
              :variant="copySuccess === 'plain' ? 'soft' : 'outline'"
              size="lg"
              class="min-h-[48px]"
              :icon="copySuccess === 'plain' ? 'i-lucide-check' : 'i-lucide-copy'"
              @click="copyAsPlainText"
            >
              {{ copySuccess === 'plain' ? 'Copied!' : 'Copy as Plain Text' }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
