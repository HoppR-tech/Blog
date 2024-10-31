import type { BlogPost, Person } from '@/types/blog'

export function generateMarkdownContent(post: BlogPost, content: string): string {
  if (Number.isNaN(new Date(post.date).getTime()))
    throw new Error('Invalid date provided')

  const frontmatter = createFrontmatter(post)
  const contentWithNbsp = content.replace(/(?<!http)(?<!https)\s*:\s*/g, '\u00A0 : ')
  return `${frontmatter}\n\n${contentWithNbsp}`
}

function createFrontmatter(post: BlogPost, assetsFolder: string = './assets'): string {
  const formattedAuthors = formatPersons(post.authors)
  const formattedReviewers = formatPersons(post.reviewers)
  return `---
title: "${post.title.replace(/\s*:\s*/g, '\u00A0 : ').replace(/"/g, '\\"')}"
date: ${post.date}
description: "${post.description.replace(/"/g, '\\"')}"
image: ${assetsFolder}/cover-image.webp
alt: "${post.alt.replace(/"/g, '\\"')}"
ogImage: ${assetsFolder}/cover-image.webp
tags: [${post.tags.map(tag => `'${tag.toLowerCase()}'`).join(', ')}]
published: ${post.published}
authors:
${formattedAuthors}
reviewers:
${formattedReviewers}
---

<!-- markdownlint-disable-file -->
`
}

function formatPersons(people: Person[]): string {
  return people.map(person => `  - id: ${person.notionId}
    name: ${person.name}
    image: ${person.image}
    linkedin: ${person.linkedin || ''}
    x: ${person.x || ''}`).join('\n')
}
