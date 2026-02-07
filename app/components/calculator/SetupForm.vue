<script setup lang="ts">
import type { EmploymentType, Participant } from '~/types'
import type { PresetParticipantConfig } from '~/composables/usePresets'

const emit = defineEmits<{
  start: [participants: Participant[], meetingDescription: string]
}>()

const { meetingTypes, defaultMeetingType } = useMeetingBurnConfig()
const setupMode = ref<'preset' | 'custom'>('preset')
const numberOfPeople = ref(3)
const meetingDescription = ref(defaultMeetingType)
const showSalaryModal = ref(false)

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
        annualSalary: 75000,
        hourlyRate: 60,
      })
    }
  }
  participantConfigs.value = next
}

function applyPresetConfigs(configs: PresetParticipantConfig[]) {
  numberOfPeople.value = configs.length
  participantConfigs.value = configs.map((p) => ({
    id: p.id,
    employmentType: p.employmentType,
    annualSalary: p.annualSalary,
    hourlyRate: p.hourlyRate,
  }))
}

watch(numberOfPeople, (val) => {
  if (val < 2) numberOfPeople.value = 2
  else if (setupMode.value === 'custom') buildParticipantConfigs()
}, { immediate: true })

watch(setupMode, (mode) => {
  if (mode === 'custom') {
    buildParticipantConfigs()
  }
})

const validationErrors = computed(() => {
  if (setupMode.value === 'preset') return []
  
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

const isValid = computed(() => {
  if (setupMode.value === 'preset') {
    return participantConfigs.value.length >= 2
  }
  return validationErrors.value.length === 0
})

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
      hourlyRate: p.employmentType === 'contractor' || p.employmentType === 'unknown' ? hourlyRate : undefined,
      effectiveHourlyRate: effectiveRate,
      isActive: true,
    }
  })
}

function handleStart() {
  if (!isValid.value) return
  emit('start', buildParticipants(), meetingDescription.value)
}

function getCalculatedRate(p: ParticipantConfig) {
  return p.employmentType === 'fulltime'
    ? (p.annualSalary / 2080).toFixed(2)
    : (p.hourlyRate ?? 0).toFixed(2)
}
</script>

<template>
  <div class="space-y-6 max-w-2xl mx-auto">
    <h2 class="text-xl font-semibold text-highlighted">
      Setup Meeting
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

    <!-- Setup Mode Toggle -->
    <UFormField label="Setup mode" size="xl">
      <div class="flex gap-3 flex-wrap">
        <UButton
          :color="setupMode === 'preset' ? 'primary' : 'neutral'"
          :variant="setupMode === 'preset' ? 'solid' : 'outline'"
          size="xl"
          class="min-h-[52px] flex-1"
          @click="setupMode = 'preset'"
        >
          Use preset
        </UButton>
        <UButton
          :color="setupMode === 'custom' ? 'primary' : 'neutral'"
          :variant="setupMode === 'custom' ? 'solid' : 'outline'"
          size="xl"
          class="min-h-[52px] flex-1"
          @click="setupMode = 'custom'"
        >
          Custom setup
        </UButton>
      </div>
      <template #help>
        <span class="text-sm text-muted">
          {{ setupMode === 'preset' ? 'Quick setup with industry averages' : 'Customize each participant individually' }}
        </span>
      </template>
    </UFormField>

    <!-- Preset Mode -->
    <div v-if="setupMode === 'preset'" class="border-b border-default pb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-medium text-muted">
          Select industry preset
        </h3>
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-info"
          @click="showSalaryModal = true"
        >
          Salary data sources
        </UButton>
      </div>
      <CalculatorPresetPicker
        @select="applyPresetConfigs"
      />
    </div>

    <!-- Custom Mode -->
    <div v-if="setupMode === 'custom'" class="space-y-6">
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
          :increment="{ color: 'neutral', variant: 'solid', size: 'sm' }"
          :decrement="{ color: 'neutral', variant: 'solid', size: 'sm' }"
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
                <UButton
                  :color="p.employmentType === 'unknown' ? 'primary' : 'neutral'"
                  :variant="p.employmentType === 'unknown' ? 'solid' : 'outline'"
                  size="lg"
                  class="min-h-[48px]"
                  @click="p.employmentType = 'unknown'"
                >
                  Unknown / estimate
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
              v-else-if="p.employmentType === 'contractor' || p.employmentType === 'unknown'"
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

    <!-- Salary Data Sources Modal -->
    <UModal v-model="showSalaryModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-highlighted">Salary Data Sources (2026)</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              size="sm"
              @click="showSalaryModal = false"
            />
          </div>
        </template>

        <div class="space-y-4 text-sm">
          <p class="text-muted">
            MeetingBurn preset salaries are based on current 2026 US market data from trusted industry sources:
          </p>

          <div class="space-y-3">
            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Tech / Software ($97,000/yr)</p>
              <p class="text-muted text-xs">Source: PayScale 2026, Motion Recruitment</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Consulting ($150/hr)</p>
              <p class="text-muted text-xs">Source: BLS Management Analysts data, Jobted</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Government / Public Sector ($75,000/yr)</p>
              <p class="text-muted text-xs">Source: CBIZ Public Sector Compensation Outlook 2026</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Corporate ($88,000/yr)</p>
              <p class="text-muted text-xs">Source: BLS, Robert Half 2026 Salary Guide</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Agency / Creative ($81,000/yr)</p>
              <p class="text-muted text-xs">Source: Robert Half Marketing & Creative 2026</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Startup ($75,000/yr)</p>
              <p class="text-muted text-xs">Source: Industry benchmarks for venture-backed startups</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Healthcare ($85,000/yr)</p>
              <p class="text-muted text-xs">Source: Robert Half Healthcare 2026</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Nonprofit / Education ($68,000/yr)</p>
              <p class="text-muted text-xs">Source: Careers in Nonprofits 2026 Report</p>
            </div>
          </div>

          <p class="text-muted text-xs pt-3 border-t border-default">
            <strong>Note:</strong> These are average estimates for starting calculations. Actual salaries vary significantly by location, experience, company size, and role. You can customize any value after selecting a preset.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="primary"
              @click="showSalaryModal = false"
            >
              Got it
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
