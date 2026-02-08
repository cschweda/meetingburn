import { describe, it, expect } from 'vitest'
import { useMeetingScore } from '~/composables/useMeetingScore'

describe('useMeetingScore', () => {
  const { computeMeetingScore } = useMeetingScore()

  describe('score bounds', () => {
    it('returns score between 0 and 100', () => {
      const result = computeMeetingScore({
        totalCost: 100,
        format: 'remote',
        meetingType: 'Stand Up',
        durationSeconds: 1800,
        participantCount: 5,
        inPersonCost: 0,
      })
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('clamps score to 0–100 for extreme inputs', () => {
      const result = computeMeetingScore({
        totalCost: 1000000,
        format: 'in-person',
        meetingType: 'Status Update',
        durationSeconds: 7200,
        participantCount: 50,
        inPersonCost: 50000,
      })
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })
  })

  describe('grade mapping', () => {
    it('returns A+ for score >= 90', () => {
      const result = computeMeetingScore({
        totalCost: 30,
        format: 'remote',
        meetingType: 'Stand Up',
        durationSeconds: 900,
        participantCount: 3,
        inPersonCost: 0,
      })
      expect(result.grade).toMatch(/^A/)
    })

    it('returns valid grade string (A+ through F)', () => {
      const validGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']
      const result = computeMeetingScore({
        totalCost: 100,
        format: 'remote',
        meetingType: 'General',
        durationSeconds: 3600,
        participantCount: 5,
        inPersonCost: 0,
      })
      expect(validGrades).toContain(result.grade)
    })
  })

  describe('format appropriateness', () => {
    it('in-person + async-friendly type yields lower score than remote', () => {
      const remote = computeMeetingScore({
        totalCost: 100,
        format: 'remote',
        meetingType: 'Stand Up',
        durationSeconds: 1800,
        participantCount: 5,
        inPersonCost: 0,
      })
      const inPerson = computeMeetingScore({
        totalCost: 100,
        format: 'in-person',
        meetingType: 'Stand Up',
        durationSeconds: 1800,
        participantCount: 5,
        inPersonCost: 50,
      })
      expect(inPerson.score).toBeLessThan(remote.score)
    })

    it('remote + async-friendly type gets bonus over neutral', () => {
      const remoteAsync = computeMeetingScore({
        totalCost: 70,
        format: 'remote',
        meetingType: 'Status Update',
        durationSeconds: 900,
        participantCount: 4,
        inPersonCost: 0,
      })
      const remoteGeneral = computeMeetingScore({
        totalCost: 70,
        format: 'remote',
        meetingType: 'General',
        durationSeconds: 900,
        participantCount: 4,
        inPersonCost: 0,
      })
      expect(remoteAsync.score).toBeGreaterThanOrEqual(remoteGeneral.score)
    })
  })

  describe('Example 7 (75-person 8hr in-person all-hands)', () => {
    it('scores low for very expensive, long, large in-person meeting', () => {
      const result = computeMeetingScore({
        totalCost: 24112,
        format: 'in-person',
        meetingType: 'All Hands',
        durationSeconds: 8 * 3600,
        participantCount: 75,
        inPersonCost: 2477,
      })
      expect(result.score).toBeLessThan(55)
      expect(result.factors).toContain('Very high total cost')
      expect(result.factors).toContain('Very long in-person duration')
      expect(result.factors).toContain('Large in-person gathering')
    })
  })

  describe('output structure', () => {
    it('returns score, grade, text, and factors', () => {
      const result = computeMeetingScore({
        totalCost: 100,
        format: 'remote',
        meetingType: 'Brainstorm',
        durationSeconds: 3600,
        participantCount: 6,
        inPersonCost: 0,
      })
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('grade')
      expect(result).toHaveProperty('text')
      expect(result).toHaveProperty('factors')
      expect(typeof result.score).toBe('number')
      expect(typeof result.grade).toBe('string')
      expect(typeof result.text).toBe('string')
      expect(Array.isArray(result.factors)).toBe(true)
      expect(result.text.length).toBeGreaterThan(0)
    })
  })

  describe('medium-sized meetings (8-14 people)', () => {
    it('should penalize medium-sized meetings with 11 people', () => {
      const result = computeMeetingScore({
        totalCost: 1000,
        format: 'remote',
        meetingType: 'General',
        durationSeconds: 3600,
        participantCount: 11,
        inPersonCost: 0,
      })

      expect(result.score).toBe(95) // 100 - 5 for medium-sized meeting
      expect(result.factors).toContain('Medium-sized meeting (consider if all attendees are necessary)')
    })

    it('should not penalize small meetings (7 or fewer)', () => {
      const result = computeMeetingScore({
        totalCost: 500,
        format: 'remote',
        meetingType: 'General',
        durationSeconds: 1800,
        participantCount: 7,
        inPersonCost: 0,
      })

      expect(result.score).toBe(100)
      expect(result.factors).not.toContain('Medium-sized meeting (consider if all attendees are necessary)')
    })

    it('should handle boundary cases correctly', () => {
      // 7 people - no penalty
      const result7 = computeMeetingScore({
        totalCost: 500,
        format: 'remote',
        meetingType: 'General',
        durationSeconds: 1800,
        participantCount: 7,
        inPersonCost: 0,
      })
      expect(result7.score).toBe(100)

      // 8 people - penalty applies
      const result8 = computeMeetingScore({
        totalCost: 500,
        format: 'remote',
        meetingType: 'General',
        durationSeconds: 1800,
        participantCount: 8,
        inPersonCost: 0,
      })
      expect(result8.score).toBe(95)

      // 14 people - still medium penalty
      const result14 = computeMeetingScore({
        totalCost: 500,
        format: 'remote',
        meetingType: 'General',
        durationSeconds: 1800,
        participantCount: 14,
        inPersonCost: 0,
      })
      expect(result14.score).toBe(95)

      // 15 people - different logic applies (async-friendly check)
      const result15 = computeMeetingScore({
        totalCost: 500,
        format: 'remote',
        meetingType: 'General',
        durationSeconds: 1800,
        participantCount: 15,
        inPersonCost: 0,
      })
      expect(result15.score).toBe(100) // No penalty because 'General' is not async-friendly
    })
  })
})
