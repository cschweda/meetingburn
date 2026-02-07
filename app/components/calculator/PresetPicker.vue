<script setup lang="ts">
import type { PresetParticipantConfig } from '~/composables/usePresets'
import type { PresetType, SectorType } from '~/types'
import { usePresets } from '~/composables/usePresets'
import { formatCurrency } from '~/utils/formatting'

const props = defineProps<{
  sectorType: SectorType
}>()

const emit = defineEmits<{
  select: [configs: PresetParticipantConfig[], presetType: PresetType]
}>()

const { PRESETS, createParticipantsFromPreset } = usePresets()
const numberOfPeople = ref(3)
const presetOrder: (Exclude<PresetType, 'custom'>)[] = [
  'tech',
  'government',
  'consulting',
  'agency',
  'corporate',
  'startup',
]

const presetItems = computed(() =>
  presetOrder.map((key) => ({ key, preset: PRESETS[key] }))
)

const presetColorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'neutral'> = {
  blue: 'primary',
  purple: 'secondary',
  green: 'success',
  slate: 'neutral',
  gray: 'neutral',
  pink: 'warning',
}

const selectedPreset = ref<Exclude<PresetType, 'custom'> | null>(null)

function getPresetForSector(sector: SectorType): Exclude<PresetType, 'custom'> {
  return sector === 'public' ? 'government' : 'tech'
}

function applyPreset(presetType: Exclude<PresetType, 'custom'>) {
  selectedPreset.value = presetType
  const preset = PRESETS[presetType]
  const count = Math.max(2, Math.min(50, numberOfPeople.value))
  const configs = createParticipantsFromPreset(preset, count)
  emit('select', configs, presetType)
}

function applyPresetFromSector(sector: SectorType) {
  const presetType = getPresetForSector(sector)
  selectedPreset.value = presetType
  const preset = PRESETS[presetType]
  const count = Math.max(2, Math.min(50, numberOfPeople.value))
  const configs = createParticipantsFromPreset(preset, count)
  emit('select', configs, presetType)
}

watch(
  () => props.sectorType,
  (sector) => {
    applyPresetFromSector(sector)
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-muted">
      Quick setup with industry preset
    </h3>
    <UFormField label="Number of people" size="lg">
      <UInputNumber
        v-model="numberOfPeople"
        :min="2"
        :max="50"
        placeholder="3"
        size="lg"
        class="max-w-32"
        aria-label="Number of participants for preset"
        :increment="{ color: 'neutral', variant: 'solid', size: 'xs' }"
        :decrement="{ color: 'neutral', variant: 'solid', size: 'xs' }"
      />
    </UFormField>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
