<script setup lang="ts">
import type { EmploymentType, Participant, SectorType } from '~/types'

const emit = defineEmits<{
  start: [participants: Participant[], sectorType: SectorType, meetingDescription: string]
}>()

const { meetingTypes, defaultMeetingType } = useMeetcostConfig()
const numberOfPeople = ref(2)
const sectorType = ref<SectorType>('public')
const meetingDescription = ref(defaultMeetingType)

interface ParticipantConfig {
  id: string
  employmentType: EmploymentType
  annualSalary: number
  hourlyRate: number
}

const participantConfigs = ref<ParticipantConfig[]>([])

function buildParticipantConfigs() {
  const count = Math.max(2, Math.min(50, numberOfPeople.value))
  const existing = participantConfigs.value
  const next: ParticipantConfig[] = []

  for (let i = 0; i < count; i++) {
    const existingItem = existing[i]
    if (existingItem) {
      next.push(existingItem)
    } else {
      next.push({
        id: `p-${Date.now()}-${i}`,
        employmentType: 'fulltime',
        annualSalary: 90000,
        hourlyRate: 60,
      })
    }
  }
  participantConfigs.value = next
}

watch(numberOfPeople, buildParticipantConfigs, { immediate: true })

const validationErrors = computed(() => {
  const errors: string[] = []
  if (numberOfPeople.value < 2 || numberOfPeople.value > 50) {
    errors.push('Number of people must be between 2 and 50')
  }
  for (const p of participantConfigs.value) {
    if (p.employmentType === 'fulltime') {
      if (p.annualSalary < 20000 || p.annualSalary > 500000) {
        errors.push(`Participant ${participantConfigs.value.indexOf(p) + 1}: Annual salary must be $20,000–$500,000`)
      }
    } else {
      if (p.hourlyRate < 10 || p.hourlyRate > 500) {
        errors.push(`Participant ${participantConfigs.value.indexOf(p) + 1}: Hourly rate must be $10–$500`)
      }
    }
  }
  return errors
})

const isValid = computed(() => validationErrors.value.length === 0)

function buildParticipants(): Participant[] {
  return participantConfigs.value.map((p) => {
    const annualSalary = Number(p.annualSalary) || 0
    const hourlyRate = Number(p.hourlyRate) || 0
    const effectiveRate =
      p.employmentType === 'fulltime'
        ? annualSalary / 2080
        : hourlyRate
    return {
      id: p.id,
      employmentType: p.employmentType,
      annualSalary: p.employmentType === 'fulltime' ? annualSalary : undefined,
      hourlyRate: p.employmentType === 'contractor' ? hourlyRate : undefined,
      effectiveHourlyRate: effectiveRate,
      isActive: true,
    }
  })
}

function handleStart() {
  if (!isValid.value) return
  emit('start', buildParticipants(), sectorType.value, meetingDescription.value)
}

function getCalculatedRate(p: ParticipantConfig) {
  return p.employmentType === 'fulltime'
    ? (p.annualSalary / 2080).toFixed(2)
    : p.hourlyRate.toFixed(2)
}
</script>

<template>
    <div class="space-y-6 max-w-2xl mx-auto">
    <h2 class="text-xl font-semibold text-highlighted">
      Setup Participants
    </h2>

    <UFormField label="Meeting type" size="xl">
      <USelect
        v-model="meetingDescription"
        :items="[...meetingTypes]"
        size="xl"
        class="w-full"
        :ui="{ base: 'min-h-[56px] text-xl' }"
        placeholder="Select meeting type"
        aria-label="Meeting type"
      />
    </UFormField>

    <UFormField label="Sector" size="xl">
      <div class="flex gap-3 flex-wrap">
        <UButton
          :color="sectorType === 'private' ? 'primary' : 'neutral'"
          :variant="sectorType === 'private' ? 'solid' : 'outline'"
          size="xl"
          class="min-h-[52px] flex-1"
          @click="sectorType = 'private'"
        >
          Private sector
        </UButton>
        <UButton
          :color="sectorType === 'public' ? 'primary' : 'neutral'"
          :variant="sectorType === 'public' ? 'solid' : 'outline'"
          size="xl"
          class="min-h-[52px] flex-1"
          @click="sectorType = 'public'"
        >
          Public sector (taxpayer dollars)
        </UButton>
      </div>
      <template #help>
        <span class="text-sm text-muted">MeetCost assumes all public-sector dollars are taxpayer-funded.</span>
      </template>
    </UFormField>

    <UFormField label="Number of people" required size="xl">
      <UInputNumber
        v-model="numberOfPeople"
        :min="2"
        :max="50"
        placeholder="e.g., 3"
        size="xl"
        class="w-full"
        :ui="{ base: 'min-h-[56px] text-xl' }"
        aria-label="Number of meeting participants"
        @update:model-value="buildParticipantConfigs"
      />
    </UFormField>

    <div class="space-y-6">
      <h3 class="text-lg font-medium text-muted">
        Participant details
      </h3>
      <div
        v-for="(p, idx) in participantConfigs"
        :key="p.id"
        class="p-6 rounded-xl border border-default bg-muted/20"
      >
        <p class="text-sm font-medium text-muted mb-4">
          Participant {{ idx + 1 }}
        </p>
        <div class="space-y-4">
          <UFormField label="Employment type" size="lg">
            <div class="flex gap-3 flex-wrap">
              <UButton
                :color="p.employmentType === 'fulltime' ? 'primary' : 'neutral'"
                :variant="p.employmentType === 'fulltime' ? 'solid' : 'outline'"
                size="lg"
                class="min-h-[48px]"
                @click="p.employmentType = 'fulltime'"
              >
                Full-time (salary)
              </UButton>
              <UButton
                :color="p.employmentType === 'contractor' ? 'primary' : 'neutral'"
                :variant="p.employmentType === 'contractor' ? 'solid' : 'outline'"
                size="lg"
                class="min-h-[48px]"
                @click="p.employmentType = 'contractor'"
              >
                Contractor (hourly)
              </UButton>
            </div>
          </UFormField>
          <UFormField
            v-if="p.employmentType === 'fulltime'"
            label="Annual salary"
            required
            size="lg"
          >
            <UInputNumber
              v-model="p.annualSalary"
              :min="20000"
              :max="500000"
              :step="1000"
              placeholder="90,000"
              size="lg"
              class="w-full"
              :ui="{ base: 'min-h-[48px]' }"
            />
            <template #help>
              <span class="text-sm text-muted">${{ getCalculatedRate(p) }}/hr</span>
            </template>
          </UFormField>
          <UFormField
            v-else
            label="Hourly rate"
            required
            size="lg"
          >
            <UInputNumber
              v-model="p.hourlyRate"
              :min="10"
              :max="500"
              :step="5"
              placeholder="60"
              size="lg"
              class="w-full"
              :ui="{ base: 'min-h-[48px]' }"
            />
          </UFormField>
        </div>
      </div>
    </div>

    <UAlert
      v-if="validationErrors.length"
      color="error"
      variant="soft"
      :title="validationErrors[0]"
      class="mt-2"
    />

    <UButton
      size="xl"
      color="primary"
      class="w-full min-h-[60px] text-xl font-bold"
      :disabled="!isValid"
      aria-label="Start meeting tracking"
      @click="handleStart"
    >
      Start Meeting
    </UButton>
  </div>
</template>
