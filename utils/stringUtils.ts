export function createFolderName(date: string, title: string): string {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime()))
    throw new Error('Date invalide fournie')

  const formattedDate = parsedDate.toISOString().split('T')[0] // Format: YYYY-MM-DD
  const slugifiedTitle = slugify(title)
  return `${formattedDate}-${slugifiedTitle}`
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // [label](url) -> label
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')  // ***bold italic***, **bold**, *italic*
    .replace(/_([^_]+)_/g, '$1')               // _italic_
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}
