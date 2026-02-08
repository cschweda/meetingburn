<script setup lang="ts">
import type { EmploymentType, Participant } from '~/types'
import type { PresetParticipantConfig } from '~/composables/usePresets'
import { formatCurrency } from '~/utils/formatting'
import { calculateInPersonCost } from '~/utils/calculations'

const emit = defineEmits<{
  start: [
    participants: Participant[],
    meetingDescription: string,
    presetType?: import('~/types').PresetType,
    format?: import('~/types').MeetingFormat,
    applyInPersonTax?: boolean,
    commuteMinutesPerPerson?: number,
    inPersonExtrasPerPerson?: number
  ]
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
const selectedPresetType = ref<import('~/types').PresetType | null>(null)
const meetingFormat = ref<import('~/types').MeetingFormat>('remote')
const applyInPersonTax = ref(true)
const commuteMinutesPerPerson = ref(30)
const inPersonExtrasPerPerson = ref(0)
const showPresetParticipantCards = ref(false)

function buildParticipantConfigs() {
  const count = Math.max(2, Math.min(100, numberOfPeople.value))
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

function applyPresetConfigs(configs: PresetParticipantConfig[], presetType?: import('~/types').PresetType) {
  numberOfPeople.value = configs.length
  selectedPresetType.value = (presetType && presetType !== 'custom') ? presetType : null
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
    selectedPresetType.value = null
  } else {
    participantConfigs.value = []
    selectedPresetType.value = null
  }
})

const validationErrors = computed(() => {
  const errors: string[] = []
  if (numberOfPeople.value < 2 || numberOfPeople.value > 100) {
    errors.push('Number of people must be between 2 and 100')
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
  const preset = setupMode.value === 'preset' ? selectedPresetType.value ?? undefined : undefined
  emit(
    'start',
    buildParticipants(),
    meetingDescription.value,
    preset,
    meetingFormat.value,
    meetingFormat.value === 'in-person' ? applyInPersonTax.value : undefined,
    meetingFormat.value === 'in-person' ? commuteMinutesPerPerson.value : undefined,
    meetingFormat.value === 'in-person' ? inPersonExtrasPerPerson.value : undefined
  )
}

function getCalculatedRate(p: ParticipantConfig) {
  return p.employmentType === 'fulltime'
    ? (p.annualSalary / 2080).toFixed(2)
    : (p.hourlyRate ?? 0).toFixed(2)
}

/** Per-person in-person cost breakdown for live preview (commute + extras) */
const inPersonCostPreview = computed(() => {
  const participants = buildParticipants()
  if (participants.length < 2) return null
  const total = calculateInPersonCost(
    participants,
    commuteMinutesPerPerson.value,
    inPersonExtrasPerPerson.value
  )
  const commuteOnly = calculateInPersonCost(
    participants,
    commuteMinutesPerPerson.value,
    0
  )
  const commutePerPerson = commuteOnly / participants.length
  const extrasPerPerson = inPersonExtrasPerPerson.value
  const totalPerPerson = total / participants.length
  return {
    commutePerPerson,
    extrasPerPerson,
    totalPerPerson,
    participantCount: participants.length,
    totalAll: total,
  }
})
</script>

<template>
  <div class="space-y-6 max-w-2xl mx-auto w-full min-w-0">
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

    <UFormField label="Meeting format" size="xl">
      <div class="flex gap-3 flex-wrap">
        <UButton
          :color="meetingFormat === 'remote' ? 'primary' : 'neutral'"
          :variant="meetingFormat === 'remote' ? 'solid' : 'outline'"
          size="xl"
          class="min-h-[52px] flex-1"
          @click="meetingFormat = 'remote'"
        >
          Remote
        </UButton>
        <UButton
          :color="meetingFormat === 'in-person' ? 'primary' : 'neutral'"
          :variant="meetingFormat === 'in-person' ? 'solid' : 'outline'"
          size="xl"
          class="min-h-[52px] flex-1"
          @click="meetingFormat = 'in-person'"
        >
          In-person
        </UButton>
      </div>
      <template #help>
        <span class="text-sm text-muted">
          {{ meetingFormat === 'remote' ? 'Video/phone—no travel cost' : 'Physical meeting—optional in-person cost' }}
        </span>
      </template>
    </UFormField>

    <div v-if="meetingFormat === 'in-person'" class="space-y-4 p-4 rounded-xl border border-default bg-muted/20">
      <UCheckbox
        v-model="applyInPersonTax"
        label="Include in-person cost (typically paid by employees)"
        size="lg"
      />
      <p v-if="applyInPersonTax" class="text-sm text-muted pl-6">
        These costs are usually out-of-pocket for employees. We itemize who pays what on the receipt.
      </p>
      <div v-if="applyInPersonTax" class="space-y-4 pl-6">
        <p class="text-sm text-muted">
          <strong class="text-foreground">Included by default:</strong> Commute time value—the dollar value of time spent commuting (each person’s hourly rate × round-trip minutes ÷ 60).
        </p>
        <p class="text-sm text-muted">
          <strong class="text-foreground">Extra cost:</strong> Optional out-of-pocket expenses beyond commute time—e.g. coffee, parking, childcare, tolls. Add a per-person dollar amount if applicable.
        </p>
        <UFormField label="Commute time (round-trip per person)" size="lg">
          <USelect
            v-model="commuteMinutesPerPerson"
            :items="[
              { label: '15 min', value: 15 },
              { label: '30 min (default)', value: 30 },
              { label: '45 min', value: 45 },
              { label: '60 min', value: 60 },
              { label: '90 min', value: 90 },
              { label: '120 min', value: 120 },
            ]"
            size="lg"
            class="w-full"
            value-attribute="value"
          />
        </UFormField>
        <UFormField label="Extra cost per person ($)" size="lg">
          <UInputNumber
            v-model="inPersonExtrasPerPerson"
            :min="0"
            :max="200"
            :step="5"
            placeholder="0"
            size="lg"
            class="w-full max-w-32"
          />
          <template #help>
            <span class="text-sm text-muted">Coffee, parking, daycare, tolls, etc.</span>
          </template>
        </UFormField>
        <div v-if="inPersonCostPreview" class="rounded-lg border border-default bg-muted/20 p-4 text-sm">
          <p class="font-medium text-foreground mb-2">Per-person in-person cost (live)</p>
          <p class="text-muted space-y-1">
            Commute time value: {{ formatCurrency(inPersonCostPreview.commutePerPerson) }}
            <span v-if="inPersonCostPreview.extrasPerPerson > 0">
              + Extra: {{ formatCurrency(inPersonCostPreview.extrasPerPerson) }}
            </span>
          </p>
          <p class="font-semibold text-foreground mt-2">
            = {{ formatCurrency(inPersonCostPreview.totalPerPerson) }} avg per person
            <span class="font-normal text-muted">({{ formatCurrency(inPersonCostPreview.totalAll) }} total for {{ inPersonCostPreview.participantCount }} people)</span>
          </p>
          <p class="text-xs text-muted mt-1">Not exact—commute, daycare, coffee, etc. vary per person.</p>
        </div>
      </div>
    </div>

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
      <UFormField class="mb-8">
        <template #label>
          <span class="text-xl font-semibold text-foreground">Number of people</span>
        </template>
        <UInputNumber
          v-model="numberOfPeople"
          :min="2"
          :max="100"
          placeholder="3"
          size="xl"
          :ui="{
            root: 'w-full',
            base: 'min-h-[100px] text-6xl font-black text-center py-4',
            increment: '[&_button]:!min-w-20 [&_button]:!min-h-20 [&_button]:!flex [&_button]:!items-center [&_button]:!justify-center [&_svg]:!size-12 [&_svg]:!stroke-[5]',
            decrement: '[&_button]:!min-w-20 [&_button]:!min-h-20 [&_button]:!flex [&_button]:!items-center [&_button]:!justify-center [&_svg]:!size-12 [&_svg]:!stroke-[5]',
          }"
          aria-label="Number of participants for preset"
          :increment="{ color: 'neutral', variant: 'solid', size: 'xl' }"
          :decrement="{ color: 'neutral', variant: 'solid', size: 'xl' }"
        />
      </UFormField>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xl font-semibold text-highlighted">
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
        :number-of-people="numberOfPeople"
        @select="applyPresetConfigs"
      />

      <!-- Preset mode: show participant editor when <= 10, hidden by default -->
      <div
        v-if="participantConfigs.length >= 2 && participantConfigs.length <= 10"
        class="mt-6 space-y-4"
      >
        <UButton
          v-if="!showPresetParticipantCards"
          variant="outline"
          color="neutral"
          size="lg"
          icon="i-lucide-settings-2"
          class="w-full"
          @click="showPresetParticipantCards = true"
        >
          Adjust per-participant salaries
        </UButton>
        <div v-else class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-highlighted">
              Participant details
            </h3>
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-x"
              aria-label="Hide participant details"
              @click="showPresetParticipantCards = false"
            />
          </div>
          <p class="text-sm text-muted">
            Adjust individual salaries as needed.
          </p>
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

      <!-- Preset mode: >10 participants, use defaults -->
      <p
        v-else-if="participantConfigs.length > 10"
        class="mt-6 text-sm text-muted"
      >
        Using preset defaults for all {{ participantConfigs.length }} participants.
      </p>
    </div>

    <!-- Custom Mode -->
    <div v-if="setupMode === 'custom'" class="space-y-6">
      <UFormField label="Number of people" required size="xl">
        <UInputNumber
          v-model="numberOfPeople"
          :min="2"
          :max="100"
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
        <h3 class="text-xl font-semibold text-highlighted">
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
      v-if="participantConfigs.length >= 2"
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
    <UModal
      v-model:open="showSalaryModal"
      title="Salary Data Sources (2026)"
      description="Industry salary sources and data references for 2026."
    >
      <template #body>
        <div class="space-y-4 text-sm">
          <p class="text-muted">
            MeetingBurn preset salaries are based on current 2026 US market data from trusted industry sources. <strong>These are averages and may be lower than expected</strong> for senior roles or higher-cost regions—adjust as needed.
          </p>

          <div class="space-y-3">
            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Tech / Software ($97,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.payscale.com/research-and-insights/us-compensation-trends" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">PayScale</a>, Motion Recruitment</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Consulting ($150/hr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Management Analysts, Jobted</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Government / Public Sector ($75,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.cbiz.com/insights/article/2026-compensation-outlook-insights-to-drive-effective-salary-planning-for-government-leaders" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">CBIZ</a> Public Sector Compensation Outlook 2026</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Corporate ($88,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a>, <a href="https://www.roberthalf.com/us/en/insights/salary-guide" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Robert Half 2026</a></p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Agency / Creative ($81,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.roberthalf.com/us/en/insights/salary-guide" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Robert Half</a> Marketing & Creative 2026</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Startup ($75,000/yr)</p>
              <p class="text-muted text-xs">Source: Industry benchmarks for venture-backed startups</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Healthcare ($85,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.roberthalf.com/us/en/insights/salary-guide" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Robert Half</a> Healthcare 2026</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Nonprofit / Education ($68,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.careersinnonprofits.com/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Careers in Nonprofits</a> 2026 Report</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Legal ($105,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Legal, <a href="https://www.roberthalf.com/us/en/insights/salary-guide" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Robert Half</a> Legal 2026</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Finance / Banking ($110,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Financial, <a href="https://www.roberthalf.com/us/en/insights/salary-guide" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Robert Half</a> Finance 2026</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Manufacturing / Industrial ($75,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Manufacturing</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Retail / Hospitality ($54,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Retail Trade, Hospitality</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Other ($50,000/yr)</p>
              <p class="text-muted text-xs">Generic baseline—adjust as needed for your context</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Social Media / Influencer ($100/hr)</p>
              <p class="text-muted text-xs">Source: Creator economy rates, brand deal benchmarks</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Vibe Coder / Freelance Dev ($125/hr)</p>
              <p class="text-muted text-xs">Source: Freelance dev platforms, contractor rates</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Real Estate ($65,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Real Estate, <a href="https://www.nar.realtor/research-and-statistics" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">NAR</a></p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Construction ($78,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Construction</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Education K–12 / Higher Ed ($62,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Education, <a href="https://www.nea.org/research-publications" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">NEA</a></p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Media / Journalism ($58,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Media</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Insurance ($75,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a>, <a href="https://www.roberthalf.com/us/en/insights/salary-guide" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Robert Half 2026</a></p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Energy / Utilities ($90,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Utilities</p>
            </div>

            <div class="p-3 rounded-lg bg-muted/20 border border-default">
              <p class="font-semibold text-highlighted mb-1">Pharma / Biotech ($100,000/yr)</p>
              <p class="text-muted text-xs">Source: <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">BLS</a> Pharmaceutical</p>
            </div>
          </div>

          <p class="text-muted text-xs pt-3 border-t border-default">
            <strong>Note:</strong> These are average estimates and may be lower than expected for senior roles or high-cost regions. Actual salaries vary significantly by location, experience, company size, and role. You can customize any value after selecting a preset.
          </p>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end">
          <UButton
            color="primary"
            label="Got it"
            @click="close"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
