import type { EmploymentType, Participant, Preset, PresetType } from '~/types'

/**
 * Industry salary presets based on 2026 US market data
 * Sources: PayScale, Robert Half, BLS, Motion Recruitment
 * Note: These are starting estimates. All values can be customized per participant.
 */
export const PRESETS: Record<Exclude<PresetType, 'custom'>, Preset> = {
  tech: {
    type: 'tech',
    label: 'Tech / Software',
    defaultEmploymentType: 'fulltime',
    averageSalary: 97000,
    averageRate: 46.63,
    description: 'Engineers, PMs, Designers',
    color: 'blue',
  },
  consulting: {
    type: 'consulting',
    label: 'Consulting',
    defaultEmploymentType: 'contractor',
    averageRate: 150,
    description: 'Strategy, Analysis, Advisory',
    color: 'purple',
  },
  government: {
    type: 'government',
    label: 'Government / Public Sector',
    defaultEmploymentType: 'fulltime',
    averageSalary: 75000,
    averageRate: 36.06,
    description: 'Public agencies, State employees',
    color: 'slate',
  },
  agency: {
    type: 'agency',
    label: 'Agency / Creative',
    defaultEmploymentType: 'fulltime',
    averageSalary: 81000,
    averageRate: 38.94,
    description: 'Marketing, Design, Content',
    color: 'pink',
  },
  corporate: {
    type: 'corporate',
    label: 'Corporate',
    defaultEmploymentType: 'fulltime',
    averageSalary: 88000,
    averageRate: 42.31,
    description: 'Management, Operations, Business',
    color: 'gray',
  },
  startup: {
    type: 'startup',
    label: 'Startup',
    defaultEmploymentType: 'fulltime',
    averageSalary: 75000,
    averageRate: 36.06,
    description: 'Early stage, Venture-backed',
    color: 'green',
  },
  healthcare: {
    type: 'healthcare',
    label: 'Healthcare',
    defaultEmploymentType: 'fulltime',
    averageSalary: 85000,
    averageRate: 40.87,
    description: 'Clinical, Admin, Healthcare ops',
    color: 'red',
  },
  nonprofit: {
    type: 'nonprofit',
    label: 'Nonprofit / Education',
    defaultEmploymentType: 'fulltime',
    averageSalary: 68000,
    averageRate: 32.69,
    description: 'Education, Social services, NGOs',
    color: 'orange',
  },
  legal: {
    type: 'legal',
    label: 'Legal',
    defaultEmploymentType: 'fulltime',
    averageSalary: 105000,
    averageRate: 50.48,
    description: 'Attorneys, Paralegals, Legal ops',
    color: 'indigo',
  },
  finance: {
    type: 'finance',
    label: 'Finance / Banking',
    defaultEmploymentType: 'fulltime',
    averageSalary: 110000,
    averageRate: 52.88,
    description: 'Analysts, Banking, Investment',
    color: 'emerald',
  },
  manufacturing: {
    type: 'manufacturing',
    label: 'Manufacturing / Industrial',
    defaultEmploymentType: 'fulltime',
    averageSalary: 75000,
    averageRate: 36.06,
    description: 'Engineers, Production, Operations',
    color: 'amber',
  },
  retail: {
    type: 'retail',
    label: 'Retail / Hospitality',
    defaultEmploymentType: 'fulltime',
    averageSalary: 54000,
    averageRate: 25.96,
    description: 'Store ops, Management, Hospitality',
    color: 'cyan',
  },
  other: {
    type: 'other',
    label: 'Other',
    defaultEmploymentType: 'fulltime',
    averageSalary: 50000,
    averageRate: 24.04,
    description: 'Generic baseline—tweak as needed',
    color: 'gray',
  },
  influencer: {
    type: 'influencer',
    label: 'Social Media / Influencer',
    defaultEmploymentType: 'contractor',
    averageRate: 100,
    description: 'Creators, Influencers, Brand deals',
    color: 'pink',
  },
  vibeCoder: {
    type: 'vibeCoder',
    label: 'Vibe Coder / Freelance Dev',
    defaultEmploymentType: 'contractor',
    averageRate: 125,
    description: 'Freelance developers, Contract devs',
    color: 'purple',
  },
  realEstate: {
    type: 'realEstate',
    label: 'Real Estate',
    defaultEmploymentType: 'fulltime',
    averageSalary: 65000,
    averageRate: 31.25,
    description: 'Agents, Brokers, Property mgmt',
    color: 'amber',
  },
  construction: {
    type: 'construction',
    label: 'Construction',
    defaultEmploymentType: 'fulltime',
    averageSalary: 78000,
    averageRate: 37.5,
    description: 'Contractors, Project managers',
    color: 'orange',
  },
  education: {
    type: 'education',
    label: 'Education (K–12 / Higher Ed)',
    defaultEmploymentType: 'fulltime',
    averageSalary: 62000,
    averageRate: 29.81,
    description: 'Teachers, Faculty, Admin',
    color: 'blue',
  },
  media: {
    type: 'media',
    label: 'Media / Journalism',
    defaultEmploymentType: 'fulltime',
    averageSalary: 58000,
    averageRate: 27.88,
    description: 'Journalists, Editors, Content',
    color: 'slate',
  },
  insurance: {
    type: 'insurance',
    label: 'Insurance',
    defaultEmploymentType: 'fulltime',
    averageSalary: 75000,
    averageRate: 36.06,
    description: 'Agents, Underwriters, Claims',
    color: 'emerald',
  },
  energy: {
    type: 'energy',
    label: 'Energy / Utilities',
    defaultEmploymentType: 'fulltime',
    averageSalary: 90000,
    averageRate: 43.27,
    description: 'Oil, Gas, Electric, Renewables',
    color: 'green',
  },
  pharma: {
    type: 'pharma',
    label: 'Pharma / Biotech',
    defaultEmploymentType: 'fulltime',
    averageSalary: 100000,
    averageRate: 48.08,
    description: 'R&D, Clinical, Regulatory',
    color: 'indigo',
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
