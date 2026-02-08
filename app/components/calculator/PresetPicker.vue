<script setup lang="ts">
import type { PresetParticipantConfig } from '~/composables/usePresets'
import type { PresetType } from '~/types'
import { usePresets } from '~/composables/usePresets'
import { formatCurrency } from '~/utils/formatting'

const props = defineProps<{
  numberOfPeople: number
}>()

const emit = defineEmits<{
  select: [configs: PresetParticipantConfig[], presetType: PresetType]
}>()

const { PRESETS, createParticipantsFromPreset } = usePresets()
const presetOrder: (Exclude<PresetType, 'custom'>)[] = [
  'agency',
  'consulting',
  'construction',
  'corporate',
  'education',
  'energy',
  'finance',
  'government',
  'healthcare',
  'insurance',
  'legal',
  'manufacturing',
  'media',
  'nonprofit',
  'other',
  'pharma',
  'realEstate',
  'retail',
  'influencer',
  'startup',
  'tech',
  'vibeCoder',
]

const presetItems = computed(() =>
  presetOrder.map((key) => ({ key, preset: PRESETS[key] }))
)

const presetColorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'neutral' | 'error'> = {
  blue: 'primary',
  purple: 'secondary',
  green: 'success',
  slate: 'neutral',
  gray: 'neutral',
  pink: 'warning',
  red: 'error',
  orange: 'warning',
  indigo: 'primary',
  emerald: 'success',
  amber: 'warning',
  cyan: 'success',
}

const selectedPreset = ref<Exclude<PresetType, 'custom'> | null>(null)

function applyPreset(presetType: Exclude<PresetType, 'custom'>) {
  selectedPreset.value = presetType
  const preset = PRESETS[presetType]
  const count = Math.max(2, Math.min(100, props.numberOfPeople))
  const configs = createParticipantsFromPreset(preset, count)
  emit('select', configs, presetType)
}

watch(() => props.numberOfPeople, () => {
  if (selectedPreset.value) {
    applyPreset(selectedPreset.value)
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-medium text-muted mb-1">
        Quick setup with industry preset
      </h3>
      <p class="text-sm text-muted">
        Based on 2026 US salary trends. Select an industry preset. For 10 or fewer participants, you can optionally adjust individual salaries. These are averages and may be lower than expected for senior roles or high-cost regions.
      </p>
    </div>
    <div class="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 w-full min-w-0">
      <UButton
        v-for="{ key, preset } in presetItems"
        :key="key"
        :color="presetColorMap[preset.color] ?? 'neutral'"
        :variant="selectedPreset === key ? 'solid' : 'outline'"
        size="lg"
        :class="[
          'min-h-[100px] flex flex-col items-start justify-start text-left p-4 h-auto transition-all',
          selectedPreset === key && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        ]"
        @click="applyPreset(key)"
      >
        <span
          :class="[
            'font-semibold',
            selectedPreset === key ? '!text-white dark:!text-gray-900' : 'text-foreground',
          ]"
        >
          {{ preset.label }}
        </span>
        <span
          :class="[
            'text-sm mt-1',
            selectedPreset === key ? '!text-gray-100 dark:!text-gray-800' : 'text-muted',
          ]"
        >
          {{ preset.defaultEmploymentType === 'fulltime' ? 'Salary' : 'Hourly' }}
          {{ preset.defaultEmploymentType === 'fulltime' ? formatCurrency(preset.averageSalary ?? preset.averageRate * 2080) + '/yr' : formatCurrency(preset.averageRate) + '/hr' }}
        </span>
        <span
          :class="[
            'text-xs mt-0.5',
            selectedPreset === key ? '!text-gray-200 dark:!text-gray-700' : 'text-muted',
          ]"
        >
          {{ preset.description }}
        </span>
      </UButton>
    </div>
  </div>
</template>
