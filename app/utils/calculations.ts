import type { Participant } from '~/types'

const WORKING_HOURS_PER_YEAR = 2080 // 40 hrs/week × 52 weeks

export function calculateEffectiveHourlyRate(participant: Participant): number {
  if (participant.employmentType === 'fulltime' && participant.annualSalary) {
    return participant.annualSalary / WORKING_HOURS_PER_YEAR
  }
  return participant.hourlyRate ?? 0
}

export function calculateMeetingCost(
  participants: Participant[],
  durationSeconds: number
): { cost: number; error?: string } {
  try {
    if (!participants || participants.length === 0) {
      return { cost: 0, error: 'No participants provided' }
    }

    if (durationSeconds < 0) {
      return { cost: 0, error: 'Invalid duration' }
    }

    const activeParticipants = participants.filter((p) => p.isActive)

    if (activeParticipants.length === 0) {
      return { cost: 0, error: 'No active participants' }
    }

    const totalHourlyRate = activeParticipants.reduce(
      (sum, p) => sum + (p.effectiveHourlyRate || 0),
      0
    )

    if (totalHourlyRate === 0) {
      return { cost: 0, error: 'Invalid hourly rates' }
    }

    const costPerSecond = totalHourlyRate / 3600
    return { cost: costPerSecond * durationSeconds }
  } catch (error) {
    console.error('Calculation error:', error)
    return { cost: 0, error: 'Calculation failed' }
  }
}

export function getCostPerSecond(participants: Participant[]): number {
  const activeParticipants = participants.filter((p) => p.isActive)
  const totalHourlyRate = activeParticipants.reduce(
    (sum, p) => sum + (p.effectiveHourlyRate || 0),
    0
  )
  return totalHourlyRate / 3600
}
