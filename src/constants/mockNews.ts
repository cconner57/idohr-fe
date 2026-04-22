import type { INewsItem } from '@/models/news'

export const MOCK_NEWS: INewsItem[] = [
  {
    id: 'news-2026-04-01',
    title: 'Spring Adoption Event Recap',
    excerpt: 'More than 20 pets found loving homes during our spring weekend event.',
    body: 'Our spring adoption event brought together volunteers, fosters, and adopters from across the region. We celebrated more than 20 successful adoptions and connected families with pets that matched their lifestyle. Thank you to everyone who helped make this event possible.',
    imageUrl: '/images/mission.png',
    publishedAt: '2026-04-01',
    category: 'adoptions',
  },
  {
    id: 'news-2026-04-10',
    title: 'Volunteer Orientation Dates Announced',
    excerpt: 'New volunteer orientation sessions are now open for registration.',
    body: 'We have opened additional volunteer orientation sessions to support our growing rescue efforts. If you are interested in helping with feeding, cleaning, socialization, or event support, please submit a volunteer application and join an upcoming session.',
    imageUrl: '/images/watercolor.jpeg',
    publishedAt: '2026-04-10',
    category: 'community',
  },
  {
    id: 'news-2026-04-18',
    title: 'Medical Fund Drive Update',
    excerpt: 'Community donations helped us fund urgent treatments for recently rescued pets.',
    body: "Thanks to the incredible support from our community, we reached this month's medical fund target. Contributions are helping cover diagnostics, medications, and follow-up care for pets recovering from neglect or injury.",
    imageUrl: '/images/mission.png',
    publishedAt: '2026-04-18',
    category: 'rescue',
  },
]
