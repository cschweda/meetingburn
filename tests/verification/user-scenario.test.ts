import { describe, it, expect } from 'vitest'
import { useMeetingScore } from '~/composables/useMeetingScore'

describe('User scenario verification', () => {
  const { computeMeetingScore } = useMeetingScore()

  it('11-person 35-minute remote General meeting should score 95', () => {
    // Exact scenario from user's screenshot
    const result = computeMeetingScore({
      totalCost: 968,
      format: 'remote',
      meetingType: 'General',
      durationSeconds: 35 * 60 + 12, // 35 minutes 12 seconds
      participantCount: 11,
      inPersonCost: 0,
    })

    // Should no longer be perfect score
    expect(result.score).toBe(95)
    expect(result.text).toBe('Efficient use of time. Remote, lean, and justified.')
    expect(result.factors).toHaveLength(1)
    expect(result.factors[0]).toBe('Medium-sized meeting (consider if all attendees are necessary)')
  })

  it('adjusting duration to 2 hours should keep same score', () => {
    const original = computeMeetingScore({
      totalCost: 968,
      format: 'remote',
      meetingType: 'General',
      durationSeconds: 35 * 60 + 12,
      participantCount: 11,
      inPersonCost: 0,
    })

    // Adjusted to 2 hours (cost would proportionally increase)
    const adjusted = computeMeetingScore({
      totalCost: 3300, // Proportional to 2 hours
      format: 'remote',
      meetingType: 'General',
      durationSeconds: 2 * 3600,
      participantCount: 11,
      inPersonCost: 0,
    })

    // Score should be the same - only participant count penalty applies
    expect(adjusted.score).toBe(original.score)
    expect(adjusted.score).toBe(95)
  })

  it('hours input correctly calculates duration', () => {
    // Test hours input: 1 hour 30 minutes 15 seconds
    const hours = 1
    const minutes = 30
    const seconds = 15
    const totalSeconds = hours * 3600 + minutes * 60 + seconds

    expect(totalSeconds).toBe(5415)

    const result = computeMeetingScore({
      totalCost: 1500,
      format: 'remote',
      meetingType: 'General',
      durationSeconds: totalSeconds,
      participantCount: 11,
      inPersonCost: 0,
    })

    // Should still have medium-sized meeting penalty
    expect(result.score).toBe(95)
  })

  it('adjusting from 35 minutes to 1 hour 35 minutes keeps score', () => {
    const before = computeMeetingScore({
      totalCost: 968,
      format: 'remote',
      meetingType: 'General',
      durationSeconds: 35 * 60 + 12, // 35 minutes 12 seconds (no hours)
      participantCount: 11,
      inPersonCost: 0,
    })

    const after = computeMeetingScore({
      totalCost: 2700, // Proportional
      format: 'remote',
      meetingType: 'General',
      durationSeconds: 1 * 3600 + 35 * 60 + 12, // 1 hour 35 minutes 12 seconds
      participantCount: 11,
      inPersonCost: 0,
    })

    // Both should have same penalty (medium-sized meeting)
    expect(before.score).toBe(95)
    expect(after.score).toBe(95)
    expect(before.factors).toEqual(after.factors)
  })
})
