import type { DurationFormat } from '~/types'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatHourlyRate(value: number): string {
  return `${formatCurrency(value)}/hr`
}

export function formatDuration(seconds: number): DurationFormat {
  const totalSecs = Math.floor(seconds)
  const hours = Math.floor(totalSecs / 3600)
  const minutes = Math.floor((totalSecs % 3600) / 60)
  const secs = totalSecs % 60

  let readable: string
  if (hours > 0) {
    readable = `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`
  } else if (minutes > 0) {
    readable = `${minutes} minute${minutes !== 1 ? 's' : ''}`
    if (secs > 0) {
      readable += ` ${secs} second${secs !== 1 ? 's' : ''}`
    }
  } else {
    readable = `${secs} second${secs !== 1 ? 's' : ''}`
  }

  let detail: string
  if (hours > 0) {
    detail = `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    detail = secs > 0 ? `${minutes} min ${secs} sec` : `${minutes} min`
  } else {
    detail = `${secs} sec`
  }

  return {
    hours,
    minutes,
    seconds: secs,
    totalMinutes: Math.floor(totalSecs / 60),
    totalSeconds: totalSecs,
    readable,
    detail,
  }
}

export function formatElapsedTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDateISO(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10)
}

export function formatTime24(timestamp: number): string {
  const d = new Date(timestamp)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
