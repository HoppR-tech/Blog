export interface BlogPost {
  notionId: string
  title: string
  seoTitle?: string
  date: string
  description: string
  seoDescription?: string
  image: string
  alt: string
  ogImage: string
  tags: string[]
  authors: Person[]
  reviewers: Person[]
  published: boolean
  content: string
}

export interface PageContent {
  notionId: string
  authors: Person[]
  reviewers?: Person[]
  coverImage: string
  coverImageAlt: string
  tags: string[]
  title: string
  seoTitle?: string
  seoDescription?: string
  content: string
  images: { url: string, alt: string }[]
}

export interface Person {
  notionId: string
  name: string
  image: string
  linkedin?: string
  x?: string
  github?: string
  jobTitle?: string
  bio?: string
}
