import type { EmploymentType, Participant, Preset, PresetType } from '~/types'

export const PRESETS: Record<Exclude<PresetType, 'custom'>, Preset> = {
  tech: {
    type: 'tech',
    label: 'Tech / Software',
    defaultEmploymentType: 'fulltime',
    averageSalary: 95000,
    averageRate: 45.67,
    description: 'Engineers, PMs, Designers',
    color: 'blue',
  },
  consulting: {
    type: 'consulting',
    label: 'Consulting',
    defaultEmploymentType: 'contractor',
    averageRate: 125,
    description: 'Strategy, Analysis, Advisory',
    color: 'purple',
  },
  government: {
    type: 'government',
    label: 'Government / Public Sector',
    defaultEmploymentType: 'fulltime',
    averageSalary: 75000,
    averageRate: 36.06,
    description: 'State employees, Public agencies',
    color: 'slate',
  },
  agency: {
    type: 'agency',
    label: 'Agency / Creative',
    defaultEmploymentType: 'fulltime',
    averageSalary: 85000,
    averageRate: 40.87,
    description: 'Marketing, Design, Content',
    color: 'pink',
  },
  corporate: {
    type: 'corporate',
    label: 'Corporate',
    defaultEmploymentType: 'fulltime',
    averageSalary: 75000,
    averageRate: 36.06,
    description: 'General business, Operations',
    color: 'gray',
  },
  startup: {
    type: 'startup',
    label: 'Startup',
    defaultEmploymentType: 'fulltime',
    averageSalary: 65000,
    averageRate: 31.25,
    description: 'Early stage, bootstrapped',
    color: 'green',
  },
}

export interface PresetParticipantConfig {
  id: string
  employmentType: EmploymentType
  annualSalary: number
  hourlyRate: number
}

export function usePresets() {
  function createParticipantsFromPreset(
    preset: Preset,
    count: number
  ): PresetParticipantConfig[] {
    const configs: PresetParticipantConfig[] = []
    const isFulltime = preset.defaultEmploymentType === 'fulltime'
    for (let i = 0; i < count; i++) {
      configs.push({
        id: `p-${Date.now()}-${i}`,
        employmentType: preset.defaultEmploymentType,
        annualSalary: isFulltime ? (preset.averageSalary ?? preset.averageRate * 2080) : 0,
        hourlyRate: preset.averageRate,
      })
    }
    return configs
  }

  function presetToParticipants(
    preset: Preset,
    count: number
  ): Participant[] {
    const configs = createParticipantsFromPreset(preset, count)
    return configs.map((p) => ({
      id: p.id,
      employmentType: p.employmentType,
      annualSalary: p.employmentType === 'fulltime' ? p.annualSalary : undefined,
      hourlyRate: p.employmentType === 'contractor' || p.employmentType === 'unknown' ? p.hourlyRate : undefined,
      effectiveHourlyRate: p.employmentType === 'fulltime' ? p.annualSalary / 2080 : p.hourlyRate,
      isActive: true,
    }))
  }

  return {
    PRESETS,
    createParticipantsFromPreset,
    presetToParticipants,
  }
}
