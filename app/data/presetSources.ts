import type { PresetType } from '~/types'

/** Source with optional URL. When url is absent, render as plain text (e.g. "Industry benchmarks"). */
export interface PresetSource {
  name: string
  url?: string
}

export const PRESET_SOURCES: Record<Exclude<PresetType, 'custom'>, PresetSource[]> = {
  tech: [
    { name: 'PayScale', url: 'https://www.payscale.com/research-and-insights/us-compensation-trends' },
    { name: 'Motion Recruitment', url: 'https://motionrecruitment.com/it-salary' },
  ],
  consulting: [
    { name: 'BLS Management Analysts', url: 'https://www.bls.gov/oes/' },
    { name: 'Jobted', url: 'https://www.jobted.com/salary' },
  ],
  government: [
    { name: 'CBIZ Public Sector Compensation Outlook', url: 'https://www.cbiz.com/insights/article/2026-compensation-outlook-insights-to-drive-effective-salary-planning-for-government-leaders' },
  ],
  agency: [
    { name: 'Robert Half Marketing & Creative', url: 'https://www.roberthalf.com/us/en/insights/salary-guide' },
  ],
  corporate: [
    { name: 'BLS', url: 'https://www.bls.gov/oes/' },
    { name: 'Robert Half', url: 'https://www.roberthalf.com/us/en/insights/salary-guide' },
  ],
  startup: [
    { name: 'Industry benchmarks for venture-backed startups' },
  ],
  healthcare: [
    { name: 'Robert Half Healthcare', url: 'https://www.roberthalf.com/us/en/insights/salary-guide' },
  ],
  nonprofit: [
    { name: 'Careers in Nonprofits', url: 'https://www.careersinnonprofits.com/' },
  ],
  legal: [
    { name: 'BLS Legal', url: 'https://www.bls.gov/oes/' },
    { name: 'Robert Half Legal', url: 'https://www.roberthalf.com/us/en/insights/salary-guide' },
  ],
  finance: [
    { name: 'BLS Financial', url: 'https://www.bls.gov/oes/' },
    { name: 'Robert Half Finance', url: 'https://www.roberthalf.com/us/en/insights/salary-guide' },
  ],
  manufacturing: [
    { name: 'BLS Manufacturing', url: 'https://www.bls.gov/oes/' },
  ],
  retail: [
    { name: 'BLS Retail Trade, Hospitality', url: 'https://www.bls.gov/oes/' },
  ],
  other: [
    { name: 'Generic baseline—adjust as needed for your context' },
  ],
  influencer: [
    { name: 'Creator economy rates, brand deal benchmarks' },
  ],
  vibeCoder: [
    { name: 'Upwork freelance rates', url: 'https://www.upwork.com/resources/upwork-freelance-rates' },
  ],
  realEstate: [
    { name: 'BLS Real Estate', url: 'https://www.bls.gov/oes/' },
    { name: 'NAR Research', url: 'https://www.nar.realtor/research-and-statistics' },
  ],
  construction: [
    { name: 'BLS Construction', url: 'https://www.bls.gov/oes/' },
  ],
  education: [
    { name: 'BLS Education', url: 'https://www.bls.gov/oes/' },
    { name: 'NEA Research', url: 'https://www.nea.org/research-publications' },
  ],
  media: [
    { name: 'BLS Media', url: 'https://www.bls.gov/oes/' },
  ],
  insurance: [
    { name: 'BLS', url: 'https://www.bls.gov/oes/' },
    { name: 'Robert Half', url: 'https://www.roberthalf.com/us/en/insights/salary-guide' },
  ],
  energy: [
    { name: 'BLS Utilities', url: 'https://www.bls.gov/oes/' },
  ],
  pharma: [
    { name: 'BLS Pharmaceutical', url: 'https://www.bls.gov/oes/' },
  ],
}
