import { describe, it, expect } from 'vitest'
import { useMeetingScore } from '~/composables/useMeetingScore'

describe('Score updates with duration adjustment', () => {
  const { computeMeetingScore } = useMeetingScore()

  it('should update score when duration changes from 35 minutes to 2 hours', () => {
    // Original: 11 people, 35 minutes (2112 seconds), remote, general
    const original = computeMeetingScore({
      totalCost: 968,
      format: 'remote',
      meetingType: 'General',
      durationSeconds: 35 * 60 + 12, // 35 minutes 12 seconds
      participantCount: 11,
      inPersonCost: 0,
    })

    expect(original.score).toBe(95) // Should have medium-sized meeting penalty
    expect(original.factors).toContain('Medium-sized meeting (consider if all attendees are necessary)')

    // Adjusted: Same meeting but 2 hours duration
    const adjusted = computeMeetingScore({
      totalCost: 3300, // Proportionally higher cost for 2 hours
      format: 'remote',
      meetingType: 'General',
      durationSeconds: 2 * 3600, // 2 hours
      participantCount: 11,
      inPersonCost: 0,
    })

    expect(adjusted.score).toBe(95) // Same penalty for medium-sized meeting
    expect(adjusted.factors).toContain('Medium-sized meeting (consider if all attendees are necessary)')
    
    // Both should have same non-duration penalties
    expect(original.score).toBe(adjusted.score)
  })

  it('should apply long duration penalty for async-friendly meetings', () => {
    // Short status update - should be fine
    const shortStatus = computeMeetingScore({
      totalCost: 200,
      format: 'remote',
      meetingType: 'Status Update',
      durationSeconds: 30 * 60, // 30 minutes
      participantCount: 8,
      inPersonCost: 0,
    })

    // Long status update - should get penalized
    const longStatus = computeMeetingScore({
      totalCost: 800,
      format: 'remote',
      meetingType: 'Status Update',
      durationSeconds: 90 * 60, // 90 minutes (over 1 hour)
      participantCount: 8,
      inPersonCost: 0,
    })

    expect(longStatus.score).toBeLessThan(shortStatus.score)
    expect(longStatus.factors).toContain('Long duration for a status-type meeting')
  })

  it('should handle hours, minutes, and seconds correctly', () => {
    // Test with 1 hour 30 minutes 45 seconds
    const result = computeMeetingScore({
      totalCost: 1000,
      format: 'remote',
      meetingType: 'General',
      durationSeconds: 1 * 3600 + 30 * 60 + 45, // 5445 seconds
      participantCount: 5,
      inPersonCost: 0,
    })

    // Should not have any duration-related penalties
    expect(result.score).toBe(100)
    expect(result.factors).toEqual(['Meeting cost and format considered'])
  })

  it('should verify the 11-person remote General meeting scenario', () => {
    // This is the exact scenario from the user's screenshot
    const result = computeMeetingScore({
      totalCost: 968,
      format: 'remote',
      meetingType: 'General',
      durationSeconds: 35 * 60 + 12, // 35 minutes 12 seconds
      participantCount: 11,
      inPersonCost: 0,
    })

    // Should now have a penalty for medium-sized meeting
    expect(result.score).toBe(95)
    expect(result.text).toBe('Efficient use of time. Remote, lean, and justified.')
    expect(result.factors).toContain('Medium-sized meeting (consider if all attendees are necessary)')
  })

  it('should handle multiple hours duration correctly', () => {
    // Test 5 hours 45 minutes 30 seconds
    const result = computeMeetingScore({
      totalCost: 10000,
      format: 'in-person',
      meetingType: 'General',
      durationSeconds: 5 * 3600 + 45 * 60 + 30, // 20730 seconds
      participantCount: 20,
      inPersonCost: 500,
    })

    // Should have penalties for in-person and long duration
    expect(result.score).toBeLessThan(100)
    expect(result.factors).toContain('Long in-person duration')
    expect(result.factors).toContain('High total cost')
  })

  it('should verify cost per person hour only applies to in-person', () => {
    const costPerPersonHour = 160 // This would trigger "high cost" if checked
    const participantCount = 10
    const durationHours = 1
    const totalCost = costPerPersonHour * participantCount * durationHours

    // Remote meeting - should NOT be penalized for high cost per person hour
    const remote = computeMeetingScore({
      totalCost,
      format: 'remote',
      meetingType: 'General',
      durationSeconds: durationHours * 3600,
      participantCount,
      inPersonCost: 0,
    })

    // In-person meeting - SHOULD be penalized for high cost per person hour
    const inPerson = computeMeetingScore({
      totalCost,
      format: 'in-person',
      meetingType: 'General',
      durationSeconds: durationHours * 3600,
      participantCount,
      inPersonCost: 200,
    })

    expect(remote.score).toBeGreaterThan(inPerson.score)
    expect(inPerson.factors).toContain('High cost per attendee-hour (in-person)')
    expect(remote.factors).not.toContain('High cost per attendee-hour (in-person)')
  })
})
