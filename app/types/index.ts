export type EmploymentType = 'fulltime' | 'contractor' | 'unknown'

export type PresetType = 'tech' | 'consulting' | 'government' | 'agency' | 'corporate' | 'startup' | 'healthcare' | 'nonprofit' | 'custom'

/** Public = taxpayer-funded; private = company/organization dollars */
export type SectorType = 'public' | 'private'

export interface Participant {
  id: string
  employmentType: EmploymentType
  annualSalary?: number
  hourlyRate?: number
  effectiveHourlyRate: number
  role?: string
  isActive: boolean
}

export interface Meeting {
  id: string
  timestamp: number
  duration: number
  plannedDuration?: number
  participants: Participant[]
  totalCost: number
  costPerSecond: number
  costPerMinute: number
  averageRate: number
  status: 'setup' | 'running' | 'paused' | 'completed'
  notes?: string
  preset?: PresetType
  /** Public = taxpayer dollars; private = company dollars */
  sectorType?: SectorType
  /** Meeting type/description (e.g. Stand Up, Touch Base) */
  meetingDescription?: string
}

export interface Preset {
  type: PresetType
  label: string
  defaultEmploymentType: EmploymentType
  averageSalary?: number
  averageRate: number
  description: string
  color: string
}

export interface Receipt {
  id: string
  meeting: Meeting
  comparisonMetric: string
  generatedAt: number
  imageUrl?: string
  exports?: {
    markdown?: string
    plainText?: string
    csv?: string
  }
}

export interface DurationFormat {
  hours: number
  minutes: number
  seconds: number
  totalMinutes: number
  totalSeconds: number
  readable: string
  detail: string  // e.g. "45 seconds" or "1 min 23 sec" for receipt
}
