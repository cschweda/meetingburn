/**
 * MeetingBurn - Single source of truth for app configuration
 */

export const meetingburnConfig = {
  siteUrl: 'https://meetingburn.app',
  appName: 'MeetingBurn',
  appTitle: 'MeetingBurn - Meeting Cost Calculator',
  tagline: 'See the real cost of every meeting',
  defaultDescription:
    'Free meeting cost calculator. Track, analyze, and share the true cost of meetings. No login required. Privacy-first—your data never leaves your browser.',
  aboutDescription: 'MeetingBurn is a real-time meeting cost calculator that makes meeting waste visible.',
  receiptFooter: 'Tracked with MeetingBurn • meetingburn.app',
  receiptFooterMarkdown: 'Tracked with [MeetingBurn](https://meetingburn.app)',
  sectorLabels: {
    public: 'Public sector (taxpayer dollars)',
    private: 'Private sector',
  },
  sectorDisclaimer: 'MeetingBurn assumes all public-sector dollars are taxpayer-funded.',
  meetingTypes: [
    'General',
    'Stand Up',
    'Touch Base',
    'Sprint Planning',
    'Retrospective',
    'All Hands',
    'Brainstorm',
    'Kickoff',
    'Status Update',
    'Review',
    'Sync',
    'Other',
  ] as const,
  defaultMeetingType: 'General',
} as const

export type MeetingBurnConfig = typeof meetingburnConfig
