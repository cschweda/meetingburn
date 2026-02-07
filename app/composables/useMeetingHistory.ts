import type { Meeting } from '~/types'
import { useStorage } from '@vueuse/core'

const STORAGE_KEY = 'meetcost-meetings'

/** ~5–10MB typical limit; 100 meetings ~500KB–1MB estimated */
const MAX_MEETINGS = 100

export function useMeetingHistory() {
  const meetings = useStorage<Meeting[]>(STORAGE_KEY, [])

  function addMeeting(meeting: Meeting): { success: boolean; trimmed?: boolean } {
    try {
      const next = [meeting, ...meetings.value]
      meetings.value = next.slice(0, MAX_MEETINGS)
      return { success: true, trimmed: next.length > MAX_MEETINGS }
    } catch (e) {
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.code === 22)) {
        try {
          const trimmed = meetings.value.slice(0, Math.floor(meetings.value.length / 2))
          meetings.value = [meeting, ...trimmed]
          return { success: true, trimmed: true }
        } catch {
          return { success: false }
        }
      }
      throw e
    }
  }

  function updateMeeting(id: string, updated: Meeting): boolean {
    const idx = meetings.value.findIndex((m) => m.id === id)
    if (idx === -1) return false
    const next = [...meetings.value]
    next[idx] = updated
    meetings.value = next
    return true
  }

  function clearHistory() {
    meetings.value = []
  }

  return {
    meetings,
    addMeeting,
    updateMeeting,
    clearHistory,
  }
}
