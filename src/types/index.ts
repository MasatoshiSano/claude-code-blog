export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: Date
  updatedAt: Date
  author: Author
  categories: Category[]
  tags: Tag[]
  featuredImage?: string
  readingTime: number
  isPublished: boolean
  seo: SEOMetadata
}

export interface Author {
  id: string
  name: string
  bio: string
  avatar: string
  socialLinks: SocialLink[]
  articlesCount: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  articlesCount: number
  parentId?: string
  children?: Category[]
  parent?: Category
  isActive: boolean
}

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  articlesCount: number
  isActive: boolean
}

export interface SEOMetadata {
  metaTitle: string
  metaDescription: string
  ogImage: string
  keywords: string[]
  structuredData: Record<string, unknown>
}

export interface SocialLink {
  platform: 'twitter' | 'github' | 'linkedin' | 'instagram' | 'facebook' | 'website'
  url: string
  username?: string
}

export interface SearchResult {
  article: Article
  score: number
  matches: Array<{
    key: string
    value: string
    indices: [number, number][]
  }>
}

export interface TOCItem {
  id: string
  title: string
  level: number
  children?: TOCItem[]
}

export interface Comment {
  id: string
  articleId: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  createdAt: Date
  updatedAt: Date
  isApproved: boolean
  parentId?: string
  replies?: Comment[]
}

export interface NewComment {
  articleId: string
  author: {
    name: string
    email: string
  }
  content: string
  parentId?: string
}

export interface Newsletter {
  id: string
  email: string
  subscribedAt: Date
  isActive: boolean
  preferences: {
    frequency: 'daily' | 'weekly' | 'monthly'
    categories: string[]
  }
}

export interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  averageSessionDuration: number
  topPages: Array<{
    path: string
    views: number
  }>
  referrers: Array<{
    source: string
    visits: number
  }>
}

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}