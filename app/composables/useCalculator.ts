import type { Meeting, Participant, SectorType } from '~/types'
import {
  calculateEffectiveHourlyRate,
  calculateMeetingCost,
  getCostPerSecond,
} from '~/utils/calculations'
import { formatDuration } from '~/utils/formatting'
import { sanitizeString } from '~/utils/sanitize'

const WORKING_HOURS_PER_YEAR = 2080

export function useCalculator() {
  const createParticipantsFromQuickMode = (
    numberOfPeople: number,
    compensationType: 'salary' | 'hourly',
    value: number
  ): Participant[] => {
    const participants: Participant[] = []
    const effectiveRate =
      compensationType === 'salary' ? value / WORKING_HOURS_PER_YEAR : value

    for (let i = 0; i < numberOfPeople; i++) {
      participants.push({
        id: `p-${Date.now()}-${i}`,
        employmentType: compensationType === 'salary' ? 'fulltime' : 'contractor',
        annualSalary: compensationType === 'salary' ? value : undefined,
        hourlyRate: compensationType === 'hourly' ? value : undefined,
        effectiveHourlyRate: effectiveRate,
        isActive: true,
      })
    }
    return participants
  }

  const buildMeeting = (
    participants: Participant[],
    durationSeconds: number,
    startTimestamp: number,
    sectorType?: SectorType,
    meetingDescription?: string
  ): Meeting => {
    const { cost } = calculateMeetingCost(participants, durationSeconds)
    const costPerSecond = getCostPerSecond(participants)

    const sanitizedParticipants = participants.map((p) => ({
      ...p,
      role: p.role ? sanitizeString(p.role, 100) : undefined,
    }))

    return {
      id: `mtg_${Date.now()}`,
      timestamp: startTimestamp,
      duration: durationSeconds,
      participants: sanitizedParticipants,
      totalCost: cost,
      costPerSecond,
      costPerMinute: costPerSecond * 60,
      averageRate:
        participants.reduce((s, p) => s + p.effectiveHourlyRate, 0) /
        participants.length,
      status: 'completed',
      sectorType,
      meetingDescription: meetingDescription
        ? sanitizeString(meetingDescription, 200)
        : undefined,
    }
  }

  return {
    createParticipantsFromQuickMode,
    buildMeeting,
    calculateEffectiveHourlyRate,
    calculateMeetingCost,
    getCostPerSecond,
    formatDuration,
  }
}
