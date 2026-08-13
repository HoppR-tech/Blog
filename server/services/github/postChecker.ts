import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { BlogPost } from '@/types/blog'
import { SEO_DESCRIPTION_MAX_LENGTH, SEO_TITLE_MAX_LENGTH } from '@/utils/seoLimits'

export function checkPost(post: BlogPost) {
  checkImage(post.image)
  checkDate(post.date)
  checkContent(post.content)
  checkTags(post.tags)
  checkSeoMetadata(post)
}

function checkImage(image: string) {
  if (!image)
    throw new Error('Cover image is missing.')
}

function checkDate(date: string) {
  if (!date)
    throw new Error('Date is missing.')

  if (Number.isNaN(new Date(date).getTime()))
    throw new Error('Invalid date provided')
}

function checkContent(content: string) {
  if (!content)
    throw new Error('Content is missing')
}

// Tags are serialized as single-quoted YAML scalars in the frontmatter: an
// apostrophe inside a tag closes the scalar early and breaks the whole build.
function checkTags(tags: string[]) {
  const invalidTag = tags.find(tag => tag.includes('\''))
  if (invalidTag)
    throw new Error(`Tag "${invalidTag}" contains an apostrophe ('), which breaks the article frontmatter. Rename the tag in Notion before publishing.`)
}

function checkSeoMetadata(post: BlogPost) {
  if (post.seoTitle && post.seoTitle.trim().length > SEO_TITLE_MAX_LENGTH) {
    throw new Error(`SEO Title must be ${SEO_TITLE_MAX_LENGTH} characters or fewer so the HoppR suffix stays within 60 characters.`)
  }

  if (post.seoDescription && post.seoDescription.trim().length > SEO_DESCRIPTION_MAX_LENGTH) {
    throw new Error(`SEO Description must be ${SEO_DESCRIPTION_MAX_LENGTH} characters or fewer.`)
  }
}

export function checkBlocks(blocks: BlockObjectResponse[]) {
  const firstBlock = blocks[0]
  if (!firstBlock)
    throw new Error('Content is empty')
  if (firstBlock.type !== 'heading_1' && firstBlock.type !== 'paragraph')
    throw new Error('An article must start with a title or an introduction')

  if (blocks.slice(1).some(b => b.type === 'heading_1'))
    throw new Error('Heading 1 is only permitted at the start of the article content')

  checkHeadingHierarchy(blocks)
}

function checkHeadingHierarchy(blocks: BlockObjectResponse[]): void {
  const hasHeading2 = blocks.some(b => b.type === 'heading_2')
  const hasHeading3 = blocks.some(b => b.type === 'heading_3')

  if (hasHeading3 && !hasHeading2)
    throw new Error('Article contains heading 3 without any heading 2. Use heading 2 for main sections to enable Table of Contents.')
}
