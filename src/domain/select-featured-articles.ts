export interface Post {
  path: string
  date: string
  tags?: string[]
}

/**
 * Selects featured articles: one per category, excluding the 3 most recent posts
 * (already shown in "Derniers Articles"), with fallback if a category has no
 * non-recent article. Results are sorted by date DESC.
 *
 * @param allPosts - All posts sorted by date DESC
 * @param categoryValues - Category values to match against post tags (e.g. ['craft', 'cloud-platform', ...])
 * @returns Up to N articles (one per category), sorted by date DESC
 */
export function selectFeaturedArticles<T extends Post>(
  allPosts: readonly T[],
  categoryValues: readonly string[],
): T[] {
  const recentPaths = new Set(allPosts.slice(0, 3).map(p => p.path))
  const usedPaths = new Set<string>()

  const featured = categoryValues.reduce<T[]>((result, category) => {
    const categoryLower = category.toLowerCase()

    // Find first article matching this category that is NOT in recent posts AND not already selected
    const preferred = allPosts.find(
      post => (post.tags ?? []).map(t => t.toLowerCase()).includes(categoryLower)
        && !recentPaths.has(post.path)
        && !usedPaths.has(post.path),
    )

    // Fallback: first article matching this category not already selected (even if in recent)
    const fallback = allPosts.find(
      post => (post.tags ?? []).map(t => t.toLowerCase()).includes(categoryLower)
        && !usedPaths.has(post.path),
    )

    const selected = preferred ?? fallback
    if (selected) {
      usedPaths.add(selected.path)
      return [...result, selected]
    }
    return result
  }, [])

  return [...featured].sort((a, b) => b.date.localeCompare(a.date))
}
