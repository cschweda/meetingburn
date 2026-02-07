import type { Meeting, Participant } from '~/types'
import { useMeetcostConfig } from '~/composables/useMeetcostConfig'
import { formatCurrency, formatDate, formatDateISO, formatDuration, formatTime, formatTime24 } from '~/utils/formatting'
import { generateComparisonList } from '~/utils/comparisons'
import { sanitizeString } from '~/utils/sanitize'

function escapeCSV(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function getParticipantBreakdown(participants: Participant[]) {
  return {
    fulltime: participants.filter((p) => p.employmentType === 'fulltime').length,
    contractor: participants.filter((p) => p.employmentType === 'contractor').length,
    unknown: participants.filter((p) => p.employmentType === 'unknown').length,
  }
}

function getSectorLine(meeting: Meeting, labels: { public: string; private: string }) {
  if (!meeting.sectorType) return ''
  return `**Sector:** ${labels[meeting.sectorType]}\n`
}

export function useReceipt() {
  const meetcostConfig = useMeetcostConfig()

  const getSanitizedMeetingDescription = (meeting: Meeting) =>
    meeting.meetingDescription ? sanitizeString(meeting.meetingDescription, 200) : ''

  const generateMarkdown = (meeting: Meeting): string => {
    const duration = formatDuration(meeting.duration)
    const breakdown = getParticipantBreakdown(meeting.participants)
    const comparisons = generateComparisonList(meeting.totalCost)

    const breakdownLines: string[] = []
    if (breakdown.fulltime > 0) breakdownLines.push(`- ${breakdown.fulltime} full-time employees`)
    if (breakdown.contractor > 0) breakdownLines.push(`- ${breakdown.contractor} contractors`)
    if (breakdown.unknown > 0) breakdownLines.push(`- ${breakdown.unknown} unknown/estimated`)

    const sectorLine = getSectorLine(meeting, meetcostConfig.sectorLabels)

    const meetingDesc = getSanitizedMeetingDescription(meeting)
    const meetingTypeLine = meetingDesc ? `**Meeting type:** ${meetingDesc}\n` : ''

    return `# Meeting Receipt 💸

**Date:** ${formatDate(meeting.timestamp)} at ${formatTime(meeting.timestamp)}
**Duration:** ${duration.readable} (${duration.totalSeconds >= 60 ? duration.totalMinutes + ' minute' + (duration.totalMinutes !== 1 ? 's' : '') : duration.totalSeconds + ' second' + (duration.totalSeconds !== 1 ? 's' : '')})
**Attendees:** ${meeting.participants.length} people
${meetingTypeLine}${sectorLine}

## Breakdown
${breakdownLines.join('\n')}

**Average Rate:** ${formatCurrency(meeting.averageRate)}/hour

---

## Total Cost: ${formatCurrency(meeting.totalCost)}

---

### Fun Fact
This meeting cost the same as:
${comparisons.map((c) => `- ${c}`).join('\n')}

### If Repeated Weekly
Annual cost: **${formatCurrency(meeting.totalCost * 52)}**

### Burn Rates
- Per-minute: ${formatCurrency(meeting.costPerMinute)}/min
- Per-second: ${formatCurrency(meeting.costPerSecond)}/sec

### How meeting cost is calculated
- **Average rate:** Sum of each participant's hourly rate ÷ number of participants. Full-time: salary ÷ 2,080 hrs/yr (40 hrs/week × 52 weeks). Contractor: hourly rate.
- **Total cost:** (Sum of hourly rates × duration in seconds) ÷ 3,600 sec/hr

---

${meeting.sectorType === 'public' ? `*${meetcostConfig.sectorDisclaimer}*\n\n` : ''}*${meetcostConfig.receiptFooterMarkdown}*`
  }

  const generatePlainText = (meeting: Meeting): string => {
    const duration = formatDuration(meeting.duration)
    const breakdown = getParticipantBreakdown(meeting.participants)
    const comparisons = generateComparisonList(meeting.totalCost)

    const breakdownLines: string[] = []
    if (breakdown.fulltime > 0) breakdownLines.push(`- ${breakdown.fulltime} full-time employees`)
    if (breakdown.contractor > 0) breakdownLines.push(`- ${breakdown.contractor} contractors`)
    if (breakdown.unknown > 0) breakdownLines.push(`- ${breakdown.unknown} unknown/estimated`)

    const sectorLine = meeting.sectorType ? `Sector: ${meetcostConfig.sectorLabels[meeting.sectorType]}\n` : ''
    const meetingDesc = getSanitizedMeetingDescription(meeting)
    const meetingTypeLine = meetingDesc ? `Meeting type: ${meetingDesc}\n` : ''

    return `MEETING RECEIPT
===============

Date: ${formatDate(meeting.timestamp)} at ${formatTime(meeting.timestamp)}
Duration: ${duration.readable} (${duration.totalSeconds >= 60 ? duration.totalMinutes + ' minute' + (duration.totalMinutes !== 1 ? 's' : '') : duration.totalSeconds + ' second' + (duration.totalSeconds !== 1 ? 's' : '')})
Attendees: ${meeting.participants.length} people
${meetingTypeLine}${sectorLine}
Breakdown:
${breakdownLines.join('\n')}

Average Rate: ${formatCurrency(meeting.averageRate)}/hour

----------------------------------------

TOTAL COST: ${formatCurrency(meeting.totalCost)}

----------------------------------------

Fun Fact:
This meeting cost the same as:
${comparisons.map((c) => `- ${c}`).join('\n')}

If Repeated Weekly:
Annual cost: ${formatCurrency(meeting.totalCost * 52)}

Burn Rates:
- Per-minute: ${formatCurrency(meeting.costPerMinute)}/min
- Per-second: ${formatCurrency(meeting.costPerSecond)}/sec

How meeting cost is calculated:
- Average rate: Sum of each participant's hourly rate ÷ number of participants. Full-time: salary ÷ 2,080 hrs/yr (40 hrs/week × 52 weeks). Contractor: hourly rate.
- Total cost: (Sum of hourly rates × duration in seconds) ÷ 3,600 sec/hr

${meeting.sectorType === 'public' ? meetcostConfig.sectorDisclaimer + '\n\n' : ''}${meetcostConfig.receiptFooter}`
  }

  const generateCSV = (meeting: Meeting, includeParticipants = false): string => {
    const duration = formatDuration(meeting.duration)
    const breakdown = getParticipantBreakdown(meeting.participants)

    const meetingDesc = getSanitizedMeetingDescription(meeting)

    if (includeParticipants) {
      const header = 'Meeting ID,Date,Time,Participant,Employment Type,Compensation,Salary/Rate,Hourly Rate,Duration (min),Individual Cost'
      const rows = meeting.participants.map((p) => {
        const individualCost = (p.effectiveHourlyRate * meeting.duration) / 3600
        return [
          meeting.id,
          formatDateISO(meeting.timestamp),
          formatTime24(meeting.timestamp),
          p.id,
          p.employmentType,
          p.employmentType === 'fulltime' ? 'Salary' : 'Hourly',
          p.annualSalary ?? p.hourlyRate ?? '',
          formatCurrency(p.effectiveHourlyRate),
          duration.totalMinutes,
          formatCurrency(individualCost),
        ].map(escapeCSV).join(',')
      })
      return [header, ...rows].join('\n')
    }

    const header = 'Date,Time,Meeting Type,Duration (minutes),Attendees,Full-Time,Contractors,Unknown,Sector,Average Rate,Total Cost,Cost Per Minute,Cost Per Second,Annual (Weekly),Generated At'
    const row = [
      formatDateISO(meeting.timestamp),
      formatTime24(meeting.timestamp),
      meetingDesc,
      duration.totalMinutes,
      meeting.participants.length,
      breakdown.fulltime,
      breakdown.contractor,
      breakdown.unknown,
      meeting.sectorType ?? '',
      formatCurrency(meeting.averageRate),
      formatCurrency(meeting.totalCost),
      formatCurrency(meeting.costPerMinute),
      formatCurrency(meeting.costPerSecond),
      formatCurrency(meeting.totalCost * 52),
      new Date(meeting.timestamp).toISOString(),
    ].map(escapeCSV).join(',')
    return [header, row].join('\n')
  }

  const generatePDF = async (meeting: Meeting): Promise<Blob> => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    const duration = formatDuration(meeting.duration)
    const breakdown = getParticipantBreakdown(meeting.participants)
    const comparisons = generateComparisonList(meeting.totalCost)

    let y = 20
    const lineHeight = 7
    const addLine = (text: string, bold = false) => {
      doc.setFont(bold ? 'helvetica' : 'helvetica', bold ? 'bold' : 'normal')
      doc.setFontSize(bold ? 14 : 10)
      doc.text(text, 20, y)
      y += lineHeight
    }

    addLine('Meeting Receipt', true)
    y += 3
    const meetingDesc = getSanitizedMeetingDescription(meeting)
    if (meetingDesc) {
      addLine(`Meeting type: ${meetingDesc}`)
    }
    if (meeting.sectorType) {
      addLine(`Sector: ${meetcostConfig.sectorLabels[meeting.sectorType]}`)
    }
    addLine(`Date: ${formatDate(meeting.timestamp)} at ${formatTime(meeting.timestamp)}`)
    addLine(`Duration: ${duration.readable} (${duration.totalSeconds >= 60 ? duration.totalMinutes + ' min' : duration.totalSeconds + ' sec'})`)
    addLine(`Attendees: ${meeting.participants.length} people`)
    if (breakdown.fulltime > 0) addLine(`  - ${breakdown.fulltime} full-time employees`)
    if (breakdown.contractor > 0) addLine(`  - ${breakdown.contractor} contractors`)
    if (breakdown.unknown > 0) addLine(`  - ${breakdown.unknown} unknown/estimated`)
    addLine(`Average Rate: ${formatCurrency(meeting.averageRate)}/hour`)
    y += 5
    addLine(`TOTAL COST: ${formatCurrency(meeting.totalCost)}`, true)
    y += 5
    addLine('This meeting cost the same as:')
    comparisons.forEach((c) => addLine(`  - ${c}`))
    addLine(`If repeated weekly: Annual cost ${formatCurrency(meeting.totalCost * 52)}`)
    addLine(`Per-minute: ${formatCurrency(meeting.costPerMinute)}/min | Per-second: ${formatCurrency(meeting.costPerSecond)}/sec`)
    y += 5
    doc.setFontSize(8)
    doc.text('Average rate: sum of hourly rates ÷ participants. Full-time: salary ÷ 2,080 (40 hrs/wk × 52 wks). Total: sum of rates × seconds ÷ 3,600.', 20, y)
    y += 6
    if (meeting.sectorType === 'public') {
      doc.setFontSize(8)
      doc.text(meetcostConfig.sectorDisclaimer, 20, y)
      y += 6
    }
    doc.setFontSize(8)
    doc.text(meetcostConfig.receiptFooter, 20, y)

    return doc.output('blob')
  }

  const downloadFile = (content: string | Blob, filename: string, mimeType?: string) => {
    const blob = content instanceof Blob
      ? content
      : new Blob([content], { type: mimeType ?? 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async (content: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content)
        return true
      }
      const textarea = document.createElement('textarea')
      textarea.value = content
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    } catch {
      return false
    }
  }

  return {
    generateMarkdown,
    generatePlainText,
    generateCSV,
    generatePDF,
    downloadFile,
    copyToClipboard,
    getParticipantBreakdown,
  }
}
