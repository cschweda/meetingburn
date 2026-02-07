import { describe, it, expect } from 'vitest'
import {
  calculateEffectiveHourlyRate,
  calculateMeetingCost,
  getCostPerSecond,
  getAverageHourlyRate,
} from './calculations'
import type { Participant } from '~/types'

const WORKING_HOURS_PER_YEAR = 2080

function fulltimeParticipant(id: string, annualSalary: number): Participant {
  return {
    id,
    employmentType: 'fulltime',
    annualSalary,
    effectiveHourlyRate: annualSalary / WORKING_HOURS_PER_YEAR,
    isActive: true,
  }
}

function contractorParticipant(id: string, hourlyRate: number): Participant {
  return {
    id,
    employmentType: 'contractor',
    hourlyRate,
    effectiveHourlyRate: hourlyRate,
    isActive: true,
  }
}

describe('calculateEffectiveHourlyRate', () => {
  it('converts full-time annual salary to hourly (salary ÷ 2080)', () => {
    const p: Participant = {
      id: '1',
      employmentType: 'fulltime',
      annualSalary: 90000,
      effectiveHourlyRate: 0,
      isActive: true,
    }
    expect(calculateEffectiveHourlyRate(p)).toBeCloseTo(90000 / 2080, 2)
    expect(calculateEffectiveHourlyRate(p)).toBeCloseTo(43.269, 2)
  })

  it('uses hourly rate directly for contractors', () => {
    const p: Participant = {
      id: '1',
      employmentType: 'contractor',
      hourlyRate: 60,
      effectiveHourlyRate: 60,
      isActive: true,
    }
    expect(calculateEffectiveHourlyRate(p)).toBe(60)
  })
})

describe('getCostPerSecond', () => {
  it('returns total hourly rate ÷ 3600', () => {
    const participants = [
      fulltimeParticipant('1', 90000), // ~43.27/hr
      contractorParticipant('2', 60),
    ]
    const totalHourly =
      participants[0].effectiveHourlyRate + participants[1].effectiveHourlyRate
    const expected = totalHourly / 3600
    expect(getCostPerSecond(participants)).toBeCloseTo(expected, 6)
  })

  it('4 full-time at $90k + 1 contractor at $60/hr = ~0.065 per second (6.5 cents)', () => {
    const participants: Participant[] = [
      fulltimeParticipant('1', 90000),
      fulltimeParticipant('2', 90000),
      fulltimeParticipant('3', 90000),
      fulltimeParticipant('4', 90000),
      contractorParticipant('5', 60),
    ]
    const costPerSecond = getCostPerSecond(participants)
    // 4 * (90000/2080) + 60 = 173.08 + 60 = 233.08/hr
    // 233.08 / 3600 = 0.06474... ≈ 0.065
    expect(costPerSecond).toBeCloseTo(0.0647, 3)
    expect(costPerSecond).toBeCloseTo(0.065, 2)
    expect(costPerSecond * 100).toBeCloseTo(6.5, 1) // 6.5 cents per second
  })

  it('ignores inactive participants', () => {
    const active = fulltimeParticipant('1', 90000)
    const inactive = fulltimeParticipant('2', 90000)
    inactive.isActive = false
    const costWithBoth = getCostPerSecond([active, inactive])
    const costWithActiveOnly = getCostPerSecond([active])
    expect(costWithBoth).toBe(costWithActiveOnly)
  })
})

describe('getAverageHourlyRate', () => {
  it('4 full-time at $90k + 1 contractor at $60/hr = ~$46.62/hr average', () => {
    const participants: Participant[] = [
      fulltimeParticipant('1', 90000),
      fulltimeParticipant('2', 90000),
      fulltimeParticipant('3', 90000),
      fulltimeParticipant('4', 90000),
      contractorParticipant('5', 60),
    ]
    const avg = getAverageHourlyRate(participants)
    // Total: 4 * 43.27 + 60 = 173.08 + 60 = 233.08
    // Average: 233.08 / 5 = 46.616
    expect(avg).not.toBeNull()
    expect(avg).toBeCloseTo(46.62, 2)
  })

  it('returns null when no active participants', () => {
    const p = fulltimeParticipant('1', 90000)
    p.isActive = false
    expect(getAverageHourlyRate([p])).toBeNull()
  })

  it('single participant returns their rate', () => {
    const p = contractorParticipant('1', 100)
    expect(getAverageHourlyRate([p])).toBe(100)
  })

  it('ignores inactive participants in average', () => {
    const participants = [
      fulltimeParticipant('1', 90000),
      fulltimeParticipant('2', 90000),
    ]
    participants[1].isActive = false
    const avg = getAverageHourlyRate(participants)
    expect(avg).toBeCloseTo(90000 / 2080, 2)
  })
})

describe('calculateMeetingCost', () => {
  it('cost = costPerSecond × durationSeconds', () => {
    const participants = [
      fulltimeParticipant('1', 90000),
      contractorParticipant('2', 60),
    ]
    const durationSeconds = 3600 // 1 hour
    const result = calculateMeetingCost(participants, durationSeconds)
    expect(result.error).toBeUndefined()
    const costPerSecond = getCostPerSecond(participants)
    const expectedCost = costPerSecond * durationSeconds
    expect(result.cost).toBeCloseTo(expectedCost, 2)
  })

  it('1-hour meeting with 4 full-time ($90k) + 1 contractor ($60) ≈ $233', () => {
    const participants: Participant[] = [
      fulltimeParticipant('1', 90000),
      fulltimeParticipant('2', 90000),
      fulltimeParticipant('3', 90000),
      fulltimeParticipant('4', 90000),
      contractorParticipant('5', 60),
    ]
    const oneHour = 3600
    const result = calculateMeetingCost(participants, oneHour)
    expect(result.error).toBeUndefined()
    // 233.08/hr × 1 hour ≈ 233
    expect(result.cost).toBeCloseTo(233.08, 1)
  })

  it('30-min meeting costs half of 1-hour', () => {
    const participants = [
      fulltimeParticipant('1', 90000),
      contractorParticipant('2', 60),
    ]
    const oneHour = calculateMeetingCost(participants, 3600).cost
    const halfHour = calculateMeetingCost(participants, 1800).cost
    expect(halfHour).toBeCloseTo(oneHour / 2, 2)
  })

  it('returns error for no participants', () => {
    const result = calculateMeetingCost([], 3600)
    expect(result.error).toBeDefined()
    expect(result.cost).toBe(0)
  })

  it('returns error for negative duration', () => {
    const result = calculateMeetingCost(
      [fulltimeParticipant('1', 90000)],
      -100
    )
    expect(result.error).toBeDefined()
    expect(result.cost).toBe(0)
  })

  it('returns error when all participants inactive', () => {
    const p = fulltimeParticipant('1', 90000)
    p.isActive = false
    const result = calculateMeetingCost([p], 3600)
    expect(result.error).toBeDefined()
    expect(result.cost).toBe(0)
  })
})

describe('cost per second = six cents for default 5-person scenario', () => {
  it('0.065 dollars per second = 6.5 cents per second', () => {
    const participants: Participant[] = [
      fulltimeParticipant('1', 90000),
      fulltimeParticipant('2', 90000),
      fulltimeParticipant('3', 90000),
      fulltimeParticipant('4', 90000),
      contractorParticipant('5', 60),
    ]
    const costPerSecond = getCostPerSecond(participants)
    const centsPerSecond = costPerSecond * 100
    expect(centsPerSecond).toBeCloseTo(6.5, 1)
    expect(costPerSecond).toBeCloseTo(0.065, 3)
  })
})
