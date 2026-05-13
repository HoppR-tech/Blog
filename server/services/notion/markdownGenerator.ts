import type { BlogPost, Person } from '@/types/blog'

export function generateMarkdownContent(post: BlogPost, content: string): string {
  return `${createFrontmatter(post)}\n\n${content}`
}

function createFrontmatter(post: BlogPost, assetsFolder: string = './assets'): string {
  const formattedAuthors = formatPersons(post.authors)
  const formattedReviewers = formatPersons(post.reviewers)
  return `---
title: "${post.title.replace(/"/g, '\\"')}"
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

function escapeYaml(value: string): string {
  // Escape doubles quotes and wrap. Bio can be multi-line; collapse newlines.
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' ').trim()}"`
}

function formatPersons(people: Person[]): string {
  return people.map((person) => {
    const lines = [
      `  - id: ${person.notionId}`,
      `    name: ${person.name}`,
      `    image: ${person.image}`,
      `    linkedin: ${person.linkedin || ''}`,
      `    x: ${person.x || ''}`,
    ]
    if (person.github)
      lines.push(`    github: ${person.github}`)
    if (person.jobTitle)
      lines.push(`    jobTitle: ${escapeYaml(person.jobTitle)}`)
    if (person.bio)
      lines.push(`    bio: ${escapeYaml(person.bio)}`)
    return lines.join('\n')
  }).join('\n')
}
