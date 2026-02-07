/**
 * MeetCost - Single source of truth for app configuration
 */

export const meetcostConfig = {
  siteUrl: 'https://meetcost.app',
  appName: 'MeetCost',
  appTitle: 'MeetCost - Meeting Cost Calculator',
  tagline: 'See the real cost of every meeting',
  defaultDescription:
    'Free meeting cost calculator. No login required. All computation runs in your browser—your data never leaves your device. Track, analyze, and share the true cost of meetings.',
  aboutDescription: 'MeetCost is a real-time meeting cost calculator that makes meeting waste visible.',
  receiptFooter: 'Tracked with MeetCost • meetcost.app',
  receiptFooterMarkdown: 'Tracked with [MeetCost](https://meetcost.app)',
  sectorLabels: {
    public: 'Public sector (taxpayer dollars)',
    private: 'Private sector',
  },
  sectorDisclaimer: 'MeetCost assumes all public-sector dollars are taxpayer-funded.',
  meetingTypes: [
    'General',
    'Stand Up',
    'Touch Base',
    '1:1',
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

export type MeetCostConfig = typeof meetcostConfig
