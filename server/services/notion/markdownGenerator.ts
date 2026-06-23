import type { BlogPost, Person } from '@/types/blog'

export function generateMarkdownContent(post: BlogPost, content: string): string {
  return `${createFrontmatter(post)}\n\n${content}`
}

function createFrontmatter(post: BlogPost, assetsFolder: string = './assets'): string {
  const formattedAuthors = formatPersons(post.authors)
  const formattedReviewers = formatPersons(post.reviewers)
  return `---
title: ${escapeYaml(post.title)}
date: ${post.date}
description: ${escapeYaml(post.description)}
image: ${assetsFolder}/cover-image.webp
alt: ${escapeYaml(post.alt)}
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

// Wrap a string as a YAML double-quoted scalar that is always valid: escape
// backslashes and quotes, and collapse newlines to spaces. A raw newline (esp.
// with trailing whitespace) inside a quoted scalar breaks the strict YAML parser
// used by Nuxt Content, which silently drops every field after it (tags, authors,
// published…). Used for every free-text field (title, description, alt, bio…).
function escapeYaml(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s*\n\s*/g, ' ').trim()}"`
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
