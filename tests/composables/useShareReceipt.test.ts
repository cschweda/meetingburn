import { describe, it, expect } from 'vitest'
import { useShareReceipt } from '~/composables/useShareReceipt'
import type { Meeting, Participant } from '~/types'

function createTestParticipant(
  id: string,
  employmentType: 'fulltime' | 'contractor' | 'unknown',
  annualSalary?: number,
  hourlyRate?: number
): Participant {
  const participant: Participant = {
    id,
    employmentType,
    effectiveHourlyRate: 0,
    isActive: true,
  }
  if (employmentType === 'fulltime' && annualSalary) {
    participant.annualSalary = annualSalary
    participant.effectiveHourlyRate = annualSalary / 2080
  } else if (employmentType === 'contractor' && hourlyRate) {
    participant.hourlyRate = hourlyRate
    participant.effectiveHourlyRate = hourlyRate
  } else if (employmentType === 'unknown' && hourlyRate) {
    participant.hourlyRate = hourlyRate
    participant.effectiveHourlyRate = hourlyRate
  }
  return participant
}

function createTestMeeting(
  participants: Participant[],
  duration: number = 1800,
  totalCost: number = 250.50,
  sectorType: 'public' | 'private' = 'private',
  meetingDescription?: string
): Meeting {
  const averageRate = participants.reduce((sum, p) => sum + p.effectiveHourlyRate, 0) / participants.length
  return {
    id: `mtg_${Date.now()}`,
    timestamp: Date.now(),
    duration,
    participants,
    totalCost,
    costPerSecond: totalCost / duration,
    costPerMinute: (totalCost / duration) * 60,
    averageRate,
    status: 'completed',
    sectorType,
    meetingDescription,
  }
}

describe('useShareReceipt - Privacy & PII Protection', () => {
  const { meetingToPayload, encodeSharePayload, decodeSharePayload, getShareUrl } = useShareReceipt()

  describe('meetingToPayload - PII exclusion', () => {
    it('excludes individual participant salaries from payload', () => {
      const participants = [
        createTestParticipant('alice', 'fulltime', 91234),
        createTestParticipant('bob', 'fulltime', 123456),
        createTestParticipant('charlie', 'contractor', undefined, 78.5),
      ]
      const meeting = createTestMeeting(participants, 1800, 251.99, 'private', 'Team standup')
      const payload = meetingToPayload(meeting)

      // Verify no individual salary data
      expect(JSON.stringify(payload)).not.toContain('91234')
      expect(JSON.stringify(payload)).not.toContain('123456')
      expect(JSON.stringify(payload)).not.toContain('78.5')

      // Verify no participant IDs
      expect(JSON.stringify(payload)).not.toContain('alice')
      expect(JSON.stringify(payload)).not.toContain('bob')
      expect(JSON.stringify(payload)).not.toContain('charlie')
    })

    it('excludes individual hourly rates from payload', () => {
      const participants = [
        createTestParticipant('contractor1', 'contractor', undefined, 157.25),
        createTestParticipant('contractor2', 'contractor', undefined, 203.75),
      ]
      const meeting = createTestMeeting(participants, 3600, 631.11, 'private')
      const payload = meetingToPayload(meeting)

      // Verify no individual hourly rates
      expect(JSON.stringify(payload)).not.toContain('157.25')
      expect(JSON.stringify(payload)).not.toContain('203.75')

      // Verify no participant IDs
      expect(JSON.stringify(payload)).not.toContain('contractor1')
      expect(JSON.stringify(payload)).not.toContain('contractor2')
    })

    it('excludes participant IDs and names', () => {
      const participants = [
        createTestParticipant('p-12345-alice-smith', 'fulltime', 90000),
        createTestParticipant('p-67890-bob-jones', 'contractor', undefined, 75),
      ]
      const meeting = createTestMeeting(participants, 1800, 200)
      const payload = meetingToPayload(meeting)

      const payloadJson = JSON.stringify(payload)
      expect(payloadJson).not.toContain('p-12345-alice-smith')
      expect(payloadJson).not.toContain('p-67890-bob-jones')
      expect(payloadJson).not.toContain('alice')
      expect(payloadJson).not.toContain('bob')
      expect(payloadJson).not.toContain('smith')
      expect(payloadJson).not.toContain('jones')
    })

    it('includes only aggregated data in payload', () => {
      const participants = [
        createTestParticipant('p1', 'fulltime', 90000),
        createTestParticipant('p2', 'contractor', undefined, 75),
        createTestParticipant('p3', 'unknown', undefined, 50),
      ]
      const meeting = createTestMeeting(participants, 1800, 250.50, 'public', 'Quarterly review')
      const payload = meetingToPayload(meeting)

      // Verify aggregated data IS present
      expect(payload.n).toBe(3) // participant count
      expect(payload.d).toBe(1800) // duration
      expect(payload.c).toBeCloseTo(250.50, 2) // total cost (rounded)
      expect(payload.s).toBe('public') // sector
      expect(payload.m).toBe('Quarterly review') // meeting description (truncated)
      expect(payload.f).toBe(1) // fulltime count
      expect(payload.ct).toBe(1) // contractor count
      expect(payload.un).toBe(1) // unknown count

      // Verify individual data is NOT present
      expect(payload).not.toHaveProperty('participants')
      expect(payload).not.toHaveProperty('annualSalary')
      expect(payload).not.toHaveProperty('hourlyRate')
      expect(payload).not.toHaveProperty('effectiveHourlyRate')
    })

    it('truncates meeting description to 100 characters', () => {
      const longDescription = 'A'.repeat(150)
      const participants = [createTestParticipant('p1', 'fulltime', 90000)]
      const meeting = createTestMeeting(participants, 1800, 100, 'private', longDescription)
      const payload = meetingToPayload(meeting)

      expect(payload.m).toHaveLength(100)
      expect(payload.m).toBe('A'.repeat(100))
    })

    it('handles missing optional fields safely', () => {
      const participants = [createTestParticipant('p1', 'fulltime', 90000)]
      const meeting = createTestMeeting(participants, 1800, 100)
      // No sectorType, no meetingDescription
      meeting.sectorType = undefined as any
      meeting.meetingDescription = undefined

      const payload = meetingToPayload(meeting)

      expect(payload.s).toBeUndefined()
      expect(payload.m).toBeUndefined()
      expect(payload.n).toBe(1)
      expect(payload.d).toBe(1800)
    })
  })

  describe('encodeSharePayload & decodeSharePayload - round-trip integrity', () => {
    it('encodes and decodes payload without exposing raw PII', () => {
      const participants = [
        createTestParticipant('sensitive-id-123', 'fulltime', 150000),
        createTestParticipant('sensitive-id-456', 'contractor', undefined, 200),
      ]
      const meeting = createTestMeeting(participants, 1800, 450, 'private', 'Executive meeting')
      const encoded = encodeSharePayload(meeting)

      // Verify encoded string does NOT contain raw sensitive data
      expect(encoded).not.toContain('150000')
      expect(encoded).not.toContain('200')
      expect(encoded).not.toContain('sensitive-id-123')
      expect(encoded).not.toContain('sensitive-id-456')

      // Verify encoded string IS base64 (only alphanumeric + / + = )
      expect(encoded).toMatch(/^[A-Za-z0-9+/=]+$/)

      // Decode and verify only aggregated data is present
      const decoded = decodeSharePayload(encoded)
      expect(decoded).not.toBeNull()
      expect(decoded?.n).toBe(2)
      expect(decoded?.d).toBe(1800)
      expect(decoded?.c).toBeCloseTo(450, 2)
      expect(decoded?.s).toBe('private')
      expect(decoded?.m).toBe('Executive meeting')
    })

    it('decodes valid base64 payload correctly', () => {
      const participants = [createTestParticipant('p1', 'fulltime', 90000)]
      const meeting = createTestMeeting(participants, 3600, 200, 'public', 'Test')
      const encoded = encodeSharePayload(meeting)
      const decoded = decodeSharePayload(encoded)

      expect(decoded).not.toBeNull()
      expect(decoded?.t).toBe(meeting.timestamp)
      expect(decoded?.d).toBe(3600)
      expect(decoded?.n).toBe(1)
      expect(decoded?.c).toBeCloseTo(200, 2)
      expect(decoded?.s).toBe('public')
      expect(decoded?.m).toBe('Test')
    })

    it('returns null for invalid base64 payload', () => {
      const decoded = decodeSharePayload('not-valid-base64!!!')
      expect(decoded).toBeNull()
    })

    it('returns null for corrupted base64 payload', () => {
      const decoded = decodeSharePayload('YWJjZGVmZ2g=') // valid base64, but not JSON
      expect(decoded).toBeNull()
    })
  })

  describe('getShareUrl - URL generation', () => {
    it('generates a valid share URL with encoded payload', () => {
      const participants = [createTestParticipant('p1', 'fulltime', 90000)]
      const meeting = createTestMeeting(participants, 1800, 100, 'private', 'Test meeting')
      const shareUrl = getShareUrl(meeting)

      expect(shareUrl).toMatch(/^https?:\/\/[^/]+\/share\?r=[A-Za-z0-9+/=]+$/)
      expect(shareUrl).toContain('/share?r=')

      // Verify URL does NOT contain raw sensitive data
      expect(shareUrl).not.toContain('90000')
      expect(shareUrl).not.toContain('p1')
    })

    it('generates consistent URLs for the same meeting', () => {
      const participants = [createTestParticipant('p1', 'fulltime', 90000)]
      const meeting = createTestMeeting(participants, 1800, 100, 'private', 'Test')
      const url1 = getShareUrl(meeting)
      const url2 = getShareUrl(meeting)

      expect(url1).toBe(url2)
    })
  })

  describe('Overall privacy guarantees', () => {
    it('ensures no PII in full encode/decode cycle', () => {
      const participants = [
        createTestParticipant('alice-dev-12345', 'fulltime', 95123),
        createTestParticipant('bob-manager-67890', 'fulltime', 134567),
        createTestParticipant('charlie-consultant-11111', 'contractor', undefined, 178.50),
        createTestParticipant('dana-intern-22222', 'unknown', undefined, 27.75),
      ]
      const meeting = createTestMeeting(
        participants,
        5400,
        751.88,
        'private',
        'All-hands product roadmap discussion with sensitive compensation data that should be truncated at exactly 100 characters total length here okay'
      )

      // Encode
      const encoded = encodeSharePayload(meeting)

      // Verify no PII in encoded string
      expect(encoded).not.toContain('alice')
      expect(encoded).not.toContain('bob')
      expect(encoded).not.toContain('charlie')
      expect(encoded).not.toContain('dana')
      expect(encoded).not.toContain('95123')
      expect(encoded).not.toContain('134567')
      expect(encoded).not.toContain('178.50')
      expect(encoded).not.toContain('27.75')
      expect(encoded).not.toContain('12345')
      expect(encoded).not.toContain('67890')
      expect(encoded).not.toContain('11111')
      expect(encoded).not.toContain('22222')

      // Decode
      const decoded = decodeSharePayload(encoded)

      // Verify decoded payload contains only aggregated data
      expect(decoded).not.toBeNull()
      expect(decoded?.n).toBe(4) // participant count
      expect(decoded?.d).toBe(5400) // duration
      expect(decoded?.c).toBeCloseTo(751.88, 2) // total cost
      expect(decoded?.f).toBe(2) // fulltime count
      expect(decoded?.ct).toBe(1) // contractor count
      expect(decoded?.un).toBe(1) // unknown count
      expect(decoded?.m).toBeDefined()
      expect(decoded?.m?.length).toBeLessThanOrEqual(100) // truncated description

      // Verify no participant data in decoded payload
      const decodedJson = JSON.stringify(decoded)
      expect(decodedJson).not.toContain('alice')
      expect(decodedJson).not.toContain('bob')
      expect(decodedJson).not.toContain('charlie')
      expect(decodedJson).not.toContain('dana')
      expect(decodedJson).not.toContain('95123')
      expect(decodedJson).not.toContain('134567')
      expect(decodedJson).not.toContain('178.50')
      expect(decodedJson).not.toContain('27.75')
    })

    it('verifies payload contains no participants array', () => {
      const participants = [
        createTestParticipant('p1', 'fulltime', 90000),
        createTestParticipant('p2', 'contractor', undefined, 75),
      ]
      const meeting = createTestMeeting(participants, 1800, 200)
      const payload = meetingToPayload(meeting)

      expect(payload).not.toHaveProperty('participants')
      expect(Object.keys(payload)).not.toContain('participants')
    })

    it('verifies encoded URL parameter contains only base64-safe characters', () => {
      const participants = [createTestParticipant('p1', 'fulltime', 90000)]
      const meeting = createTestMeeting(participants, 1800, 100, 'private', 'Test <script>alert("xss")</script>')
      const shareUrl = getShareUrl(meeting)
      const urlMatch = shareUrl.match(/\?r=([^&]+)/)

      expect(urlMatch).not.toBeNull()
      const encodedParam = urlMatch![1]
      expect(encodedParam).toMatch(/^[A-Za-z0-9+/=]+$/)
    })
  })
})
