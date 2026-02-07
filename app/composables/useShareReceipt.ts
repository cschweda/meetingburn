import type { Meeting } from '~/types'
import { useMeetcostConfig } from '~/composables/useMeetcostConfig'

/** Minimal payload for share URL - keeps URL short */
export interface ShareReceiptPayload {
  t: number
  d: number
  n: number
  c: number
  a: number
  s?: 'public' | 'private'
  m?: string
  f: number
  ct: number
  un: number
}

export function useShareReceipt() {
  const { siteUrl } = useMeetcostConfig()

  function meetingToPayload(meeting: Meeting): ShareReceiptPayload {
    const breakdown = {
      f: meeting.participants.filter((p) => p.employmentType === 'fulltime').length,
      ct: meeting.participants.filter((p) => p.employmentType === 'contractor').length,
      un: meeting.participants.filter((p) => p.employmentType === 'unknown').length,
    }
    return {
      t: meeting.timestamp,
      d: meeting.duration,
      n: meeting.participants.length,
      c: Math.round(meeting.totalCost * 100) / 100,
      a: Math.round(meeting.averageRate * 100) / 100,
      s: meeting.sectorType,
      m: meeting.meetingDescription?.slice(0, 100),
      f: breakdown.f,
      ct: breakdown.ct,
      un: breakdown.un,
    }
  }

  function encodeSharePayload(meeting: Meeting): string {
    const payload = meetingToPayload(meeting)
    const json = JSON.stringify(payload)
    return btoa(encodeURIComponent(json))
  }

  function decodeSharePayload(encoded: string): ShareReceiptPayload | null {
    try {
      const json = decodeURIComponent(atob(encoded))
      return JSON.parse(json) as ShareReceiptPayload
    } catch {
      return null
    }
  }

  function getShareUrl(meeting: Meeting): string {
    const encoded = encodeSharePayload(meeting)
    const origin = typeof window !== 'undefined' ? window.location.origin : siteUrl
    return `${origin}/share?r=${encoded}`
  }

  async function shareNative(meeting: Meeting, text: string, pngBlob?: Blob): Promise<boolean> {
    if (!navigator.share) return false
    try {
      const shareData: ShareData = {
        title: `Meeting Cost: ${meeting.totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
        text,
        url: getShareUrl(meeting),
      }
      if (pngBlob && navigator.canShare && navigator.canShare({ files: [new File([pngBlob], 'meeting-receipt.png', { type: 'image/png' })] })) {
        shareData.files = [new File([pngBlob], 'meeting-receipt.png', { type: 'image/png' })]
      }
      await navigator.share(shareData)
      return true
    } catch (e) {
      if ((e as Error).name === 'AbortError') return false
      throw e
    }
  }

  return {
    encodeSharePayload,
    decodeSharePayload,
    getShareUrl,
    shareNative,
    meetingToPayload,
  }
}
