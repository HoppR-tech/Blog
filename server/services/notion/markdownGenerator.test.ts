import { describe, expect, it } from 'vitest'
import { generateMarkdownContent } from './markdownGenerator'
import type { BlogPost } from '@/types/blog'

describe('Markdown Utils', () => {
  it('should generate markdown content with frontmatter', () => {
    const post: BlogPost = {
      notionId: '1',
      title: 'Test Title',
      date: new Date('2024-08-02T15:59:20.808Z').toISOString(),
      description: 'This is a test description.',
      image: 'http://example.com/image.jpg',
      alt: 'Test Image',
      ogImage: 'http://example.com/og-image.jpg',
      tags: ['test', 'markdown'],
      published: true,
      authors: [],
      reviewers: [],
      content: '',
    }
    const content = 'This is the content of the post.'
    const markdown = generateMarkdownContent(post, content)

    expect(markdown).toContain('---')
    expect(markdown).toContain(`title: "${post.title}"`)
    expect(markdown).toContain(`date: ${post.date}`)
    expect(markdown).toContain(`description: "${post.description}"`)
    expect(markdown).toContain('image: ./assets/cover-image.webp')
    expect(markdown).toContain(`alt: "${post.alt}"`)
    expect(markdown).toContain(`tags: [${post.tags.map(tag => `'${tag}'`).join(', ')}]`)
    expect(markdown).toContain('---')
    expect(markdown).toContain(content)
  })

  it('should handle empty content', () => {
    const post: BlogPost = {
      notionId: '2',
      title: 'Another Test Title',
      date: new Date().toISOString(),
      description: 'Another test description.',
      image: 'http://example.com/image2.jpg',
      alt: 'Another Test Image',
      ogImage: 'http://example.com/og-image2.jpg',
      tags: [],
      published: true,
      authors: [],
      reviewers: [],
      content: '',
    }
    const content = ''
    const markdown = generateMarkdownContent(post, content)

    expect(markdown).toContain('---')
    expect(markdown).toContain(`title: "${post.title}"`)
    expect(markdown).toContain('---')
    expect(markdown).toContain(content)
  })

  it('should handle tags correctly', () => {
    const post: BlogPost = {
      notionId: '3',
      title: 'Tags Test',
      date: new Date().toISOString(),
      description: 'Testing tags.',
      image: 'http://example.com/image3.jpg',
      alt: 'Tags Test Image',
      ogImage: 'http://example.com/og-image3.jpg',
      tags: ['tag1', 'tag2', 'tag3'],
      published: true,
      authors: [],
      reviewers: [],
      content: 'Content with tags.',
    }
    const content = 'Content with tags.'
    const markdown = generateMarkdownContent(post, content)

    expect(markdown).toContain('tags: [\'tag1\', \'tag2\', \'tag3\']')
  })

  it('should handle missing optional fields gracefully', () => {
    const post: BlogPost = {
      notionId: '4',
      title: 'Missing Fields Test',
      date: new Date().toISOString(),
      description: '',
      image: '',
      alt: '',
      ogImage: '',
      tags: [],
      published: true,
      authors: [],
      reviewers: [],
      content: 'Content without optional fields.',
    }
    const content = 'Content without optional fields.'
    const markdown = generateMarkdownContent(post, content)

    expect(markdown).toContain('---')
    expect(markdown).toContain(`title: "${post.title}"`)
    expect(markdown).toContain('---')
    expect(markdown).toContain(content)
  })
})
