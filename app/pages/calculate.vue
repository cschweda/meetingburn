<script setup lang="ts">
import type { Meeting, Participant, SectorType } from '~/types'
import { useCalculator } from '~/composables/useCalculator'

definePageMeta({
  layout: 'calculator',
})

const { buildMeeting } = useCalculator()

type View = 'setup' | 'running' | 'receipt'

const view = ref<View>('setup')
const participants = ref<Participant[]>([])
const sectorType = ref<SectorType>('private')
const { defaultMeetingType } = useMeetcostConfig()
const meetingDescription = ref<string>(defaultMeetingType)
const startTime = ref(0)
const isPaused = ref(false)
const completedMeeting = ref<Meeting | null>(null)

const isRunning = computed(() => view.value === 'running')

function handleStart(newParticipants: Participant[], newSectorType: SectorType, newMeetingDescription: string) {
  participants.value = newParticipants
  sectorType.value = newSectorType
  meetingDescription.value = newMeetingDescription
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
    sectorType.value,
    meetingDescription.value
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
        :sector-type="sectorType"
        :meeting-type="meetingDescription"
        :is-running="isRunning"
        :is-paused="isPaused"
        :start-time="startTime"
        @stop="handleStop"
        @pause="handlePause"
        @resume="handleResume"
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
