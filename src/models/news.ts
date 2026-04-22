export interface INewsItem {
  id: string
  title: string
  excerpt: string
  body: string
  imageUrl?: string
  publishedAt: string
  category: 'adoptions' | 'events' | 'rescue' | 'community'
}
