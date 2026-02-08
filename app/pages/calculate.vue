<script setup lang="ts">
import type { Meeting, MeetingFormat, Participant, PresetType } from '~/types'
import { useCalculator } from '~/composables/useCalculator'
import { usePresets } from '~/composables/usePresets'

definePageMeta({
  layout: 'default',
})

const { buildMeeting } = useCalculator()
const { PRESETS } = usePresets()

type View = 'setup' | 'running' | 'receipt'

const view = ref<View>('setup')
const participants = ref<Participant[]>([])
const { defaultMeetingType } = useMeetingBurnConfig()
const meetingDescription = ref<string>(defaultMeetingType)
const presetType = ref<PresetType | undefined>(undefined)
const meetingFormat = ref<MeetingFormat>('remote')
const applyInPersonTax = ref(false)
const commuteMinutesPerPerson = ref(30)
const inPersonExtrasPerPerson = ref(0)
const startTime = ref(0)
const isPaused = ref(false)
const completedMeeting = ref<Meeting | null>(null)

const presetLabel = computed(() => {
  const pt = presetType.value
  if (!pt || pt === 'custom') return undefined
  return PRESETS[pt]?.label
})

const isRunning = computed(() => view.value === 'running')

function handleStart(
  newParticipants: Participant[],
  newMeetingDescription: string,
  newPreset?: PresetType,
  newFormat?: MeetingFormat,
  newApplyInPersonTax?: boolean,
  newCommuteMinutes?: number,
  newInPersonExtras?: number
) {
  participants.value = newParticipants
  meetingDescription.value = newMeetingDescription
  presetType.value = newPreset
  meetingFormat.value = newFormat ?? 'remote'
  applyInPersonTax.value = newApplyInPersonTax ?? false
  commuteMinutesPerPerson.value = newCommuteMinutes ?? 30
  inPersonExtrasPerPerson.value = newInPersonExtras ?? 0
  startTime.value = Date.now()
  view.value = 'running'
}

function handlePause() {
  isPaused.value = true
}

function handleResume() {
  isPaused.value = false
}

const { addMeeting } = useMeetingHistory()
const toast = useToast()

function handleStop() {
  const elapsedSeconds = Math.floor((Date.now() - startTime.value) / 1000)
  const meeting = buildMeeting(
    participants.value,
    elapsedSeconds,
    startTime.value,
    undefined,
    meetingDescription.value,
    presetType.value,
    meetingFormat.value,
    meetingFormat.value === 'in-person' ? applyInPersonTax.value : undefined,
    meetingFormat.value === 'in-person' ? commuteMinutesPerPerson.value : undefined,
    meetingFormat.value === 'in-person' ? inPersonExtrasPerPerson.value : undefined
  )
  completedMeeting.value = meeting
  const result = addMeeting(meeting)
  if (!result.success) {
    toast.add({ title: 'History full. Clear old meetings to save new ones.', color: 'warning', icon: 'i-lucide-alert-triangle' })
  }
  view.value = 'receipt'
}

function handleNewMeeting() {
  view.value = 'setup'
  participants.value = []
  meetingDescription.value = defaultMeetingType
  presetType.value = undefined
  meetingFormat.value = 'remote'
  applyInPersonTax.value = false
  commuteMinutesPerPerson.value = 30
  inPersonExtrasPerPerson.value = 0
  startTime.value = 0
  isPaused.value = false
  completedMeeting.value = null
}
</script>

<template>
  <div class="flex-1 flex flex-col">
    <template v-if="view === 'setup'">
      <div class="container mx-auto px-4 py-12 max-w-lg">
        <h1 class="text-2xl font-bold text-highlighted mb-8 text-center">
          Setup your meeting
        </h1>
        <CalculatorSetupForm @start="handleStart" />
      </div>
    </template>

    <template v-else-if="view === 'running'">
      <CalculatorLiveCounter
        :participants="participants"
        :meeting-type="meetingDescription"
        :preset-label="presetLabel"
        :format="meetingFormat"
        :apply-in-person-tax="applyInPersonTax"
        :commute-minutes-per-person="commuteMinutesPerPerson"
        :in-person-extras-per-person="inPersonExtrasPerPerson"
        :is-running="isRunning"
        :is-paused="isPaused"
        :start-time="startTime"
        @stop="handleStop"
        @pause="handlePause"
        @resume="handleResume"
        @milestone="(m) => toast.add({ title: `$${m.toLocaleString()} milestone reached!`, color: 'warning', icon: 'i-lucide-bell' })"
      />
    </template>

    <template v-else-if="view === 'receipt' && completedMeeting">
      <div class="container mx-auto px-4 py-8">
        <CalculatorReceipt
          :meeting="completedMeeting"
          @update:meeting="completedMeeting = $event"
        />
        <div class="max-w-2xl mx-auto mt-8 flex justify-center">
          <UButton
            size="xl"
            color="primary"
            variant="outline"
            class="min-h-[52px]"
            icon="i-lucide-plus"
            @click="handleNewMeeting"
          >
            Start New Meeting
          </UButton>
        </div>
      </div>
    </template>
  </div>
</template>
