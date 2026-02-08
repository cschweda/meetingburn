import type { MeetingFormat } from '~/types'

/** Input for computing a meeting score */
export interface MeetingScoreInput {
  totalCost: number
  format: MeetingFormat
  meetingType?: string
  durationSeconds: number
  participantCount: number
  inPersonCost?: number
}

/** Output of the meeting score computation */
export interface MeetingScore {
  score: number
  grade: string
  text: string
  factors: string[]
}

/** Meeting types that often work async (Slack, email, etc.) */
const ASYNC_FRIENDLY_TYPES = [
  'Stand Up',
  'Status Update',
  'Sync',
  'Touch Base',
  'Review',
];

/** Meeting types that typically benefit from in-person presence */
const IN_PERSON_JUSTIFIED_TYPES = ['Brainstorm', 'Kickoff', 'All Hands'];

/** Map raw score to letter grade */
function scoreToGrade(score: number): string {
  if (score >= 97) return 'A+'
  if (score >= 93) return 'A'
  if (score >= 90) return 'A-'
  if (score >= 87) return 'B+'
  if (score >= 83) return 'B'
  if (score >= 80) return 'B-'
  if (score >= 77) return 'C+'
  if (score >= 73) return 'C'
  if (score >= 70) return 'C-'
  if (score >= 67) return 'D+'
  if (score >= 63) return 'D'
  if (score >= 60) return 'D-'
  return 'F'
}

/** Pick whimsical text based on score range */
function getWhimsicalText(score: number, _factors: string[]): string {
  if (score >= 85) {
    return 'Efficient use of time. Remote, lean, and justified.'
  }
  if (score >= 70) {
    return 'Has Slack vibes.'
  }
  if (score >= 50) {
    return "This meeting has strong 'could have been an email' energy."
  }
  return "Ouch. Could this have been a remote 120 minute instead?"
}

export function useMeetingScore() {
  function computeMeetingScore(input: MeetingScoreInput): MeetingScore {
    const factors: string[] = []
    let score = 100

    const { totalCost, format, meetingType, durationSeconds, participantCount, inPersonCost = 0 } = input
    const durationHours = Math.max(0.001, durationSeconds / 3600)
    const costPerPersonHour = participantCount > 0
      ? totalCost / (participantCount * durationHours)
      : 0

    // Cost efficiency: high hourly rate = penalty (only for in-person where actual expenses matter)
    // For remote meetings, the "cost" is just time/salary, which is expected and not an inefficiency
    if (format === 'in-person') {
      if (costPerPersonHour > 150) {
        score -= 20
        factors.push('High cost per attendee-hour (in-person)')
      } else if (costPerPersonHour > 100) {
        score -= 10
        factors.push('Above-average cost per attendee-hour (in-person)')
      } else if (costPerPersonHour < 40 && participantCount <= 6) {
        score += 5
        factors.push('Efficient cost per attendee-hour')
      }
    }

    // Very high total cost = penalty (e.g. $24K all-day meeting)
    if (totalCost > 15000) {
      score -= 18
      factors.push('Very high total cost')
    } else if (totalCost > 8000) {
      score -= 10
      factors.push('High total cost')
    }

    // Format appropriateness
    const typeLower = (meetingType ?? '').toLowerCase()
    const isAsyncFriendly = ASYNC_FRIENDLY_TYPES.some((t) => typeLower.includes(t.toLowerCase()))
    const isInPersonJustified = IN_PERSON_JUSTIFIED_TYPES.some((t) => typeLower.includes(t.toLowerCase()))

    if (format === 'in-person') {
      if (isAsyncFriendly) {
        score -= 22
        factors.push('In-person for a meeting type that often works async')
      } else if (!isInPersonJustified) {
        score -= 8
        factors.push('In-person (may have been remote)')
      }
      if (inPersonCost > 0) {
        const inPersonRatio = inPersonCost / totalCost
        if (inPersonRatio > 0.3) {
          score -= 10
          factors.push('Significant employee cost (commute, parking, etc.)')
        } else if (inPersonCost > 500) {
          score -= 6
          factors.push('Notable employee cost (commute, parking, etc.)')
        }
      }
      // Long in-person meetings: even "justified" types get penalized at scale
      if (durationSeconds > 3600 * 6) {
        score -= 12
        factors.push('Very long in-person duration')
      } else if (durationSeconds > 3600 * 4) {
        score -= 6
        factors.push('Long in-person duration')
      }
      // Large in-person gatherings: extra penalty
      if (participantCount >= 50) {
        score -= 10
        factors.push('Large in-person gathering')
      }
    } else if (isAsyncFriendly) {
      score += 5
      factors.push('Remote for async-friendly meeting type')
    }

    // Duration appropriateness: long meetings for status-type = penalty
    if (isAsyncFriendly && durationSeconds > 3600) {
      score -= 15
      factors.push('Long duration for a status-type meeting')
    } else if (isAsyncFriendly && durationSeconds <= 900) {
      score += 5
      factors.push('Short duration for status-type meeting')
    }

    // Scale: many attendees for simple meeting = penalty
    if (participantCount >= 15 && isAsyncFriendly) {
      score -= 12
      factors.push('Large audience for a simple meeting type')
    } else if (participantCount >= 50) {
      score -= 8
      factors.push('Very large meeting')
    } else if (participantCount >= 25) {
      score -= 8
      factors.push('Large meeting')
    } else if (participantCount >= 8 && participantCount <= 14) {
      score -= 5
      factors.push('Medium-sized meeting (consider if all attendees are necessary)')
    }

    const clampedScore = Math.max(0, Math.min(100, Math.round(score)))
    const grade = scoreToGrade(clampedScore)
    const text = getWhimsicalText(clampedScore, factors)

    return {
      score: clampedScore,
      grade,
      text,
      factors: factors.length > 0 ? factors : ['Meeting cost and format considered'],
    }
  }

  return {
    computeMeetingScore,
  }
}
