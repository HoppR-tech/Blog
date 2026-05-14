import type { Person } from '@/types/blog'
import type { ImageFile } from '@/types/files'
import axios from 'axios'
import sharp from 'sharp'
import { slugify } from '@/utils/stringUtils'

const DEFAULT_AUTHOR_IMAGE = '/default-author-image.webp'

interface ConvertedImage {
  webpImageName: string
  imageContent: string
}

// Largeurs cibles pour la conversion WebP (mesurées via Lighthouse mobile) :
// - article : 1000px = 2x retina pour un affichage max ~500px (mobile 343px, desktop ~600px)
// - avatar  : 256px  = 4x retina pour un affichage max 64-128px (Footer / cards auteurs)
const ARTICLE_IMAGE_MAX_WIDTH = 1000
const AVATAR_IMAGE_MAX_WIDTH = 256

export async function downloadAndConvertImage(imageUrl: string, imageName: string, maxWidth: number = ARTICLE_IMAGE_MAX_WIDTH): Promise<ConvertedImage> {
  try {
    if (imageUrl.startsWith('./'))
      throw new Error(`The URL is a relative path: ${imageUrl}`)

    // console.log(`Attempting to download image from URL: ${imageUrl}`)
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer', maxRedirects: 0 })
    const slugifiedImageName = slugify(imageName)
    const webpImageName = `${slugifiedImageName}.webp`

    const webpBuffer = await sharp(response.data)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()

    return { webpImageName, imageContent: webpBuffer.toString('base64') }
  }
  catch (error) {
    console.error(`Error while processing image ${imageUrl}:`, error)
    throw new Error(`Error while processing image ${imageUrl}: ${(error as Error).message}`)
  }
}

export { AVATAR_IMAGE_MAX_WIDTH, ARTICLE_IMAGE_MAX_WIDTH }

export async function extractImagesAndUpdateContent(content: string): Promise<{ updatedContent: string, imageFiles: ImageFile[], lastValidImageUrl: string | null }> {
  const imageUrls = extractMarkdownImageUrls(content)
  const imageFiles: ImageFile[] = []
  let updatedContent = content
  let imageCounter = 1
  let lastValidImageUrl: string | null = null

  for (const imageUrl of imageUrls) {
    if (!imageUrl)
      continue

    try {
      const imageName = `img${imageCounter}`
      const { webpImageName, imageContent } = await downloadAndConvertImage(imageUrl, imageName)
      imageFiles.push({ name: webpImageName, content: imageContent })
      updatedContent = replaceImageLinkInMarkdown(updatedContent, imageUrl, webpImageName)
      lastValidImageUrl = imageUrl
      imageCounter++
    }
    catch (error) {
      console.error(`Error processing image: ${imageUrl}`, error)
      throw new Error(`Failed to download inline image from Notion (URL may have expired). URL: ${imageUrl}`, { cause: error })
    }
  }

  assertNoNotionImageUrlsRemain(updatedContent)

  return { updatedContent, imageFiles, lastValidImageUrl }
}

const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*\]\(([^)]+)\)/g
const NOTION_S3_HOST = 'prod-files-secure.s3'

export function extractMarkdownImageUrls(content: string): string[] {
  return [...content.matchAll(MARKDOWN_IMAGE_REGEX)].map(match => match[1]).filter((url): url is string => typeof url === 'string')
}

function assertNoNotionImageUrlsRemain(content: string): void {
  const remaining = extractMarkdownImageUrls(content).filter(url => url.includes(NOTION_S3_HOST))
  if (remaining.length > 0)
    throw new Error(`Unprocessed Notion image URLs remain in content after extraction: ${remaining.join(', ')}`)
}

export async function processAuthorsImages(authors: Person[]): Promise<{ updatedAuthors: Person[], authorImages: ImageFile[] }> {
  const { updatedPersons, personImages } = await processPersonsImages(authors, 'author')
  return { updatedAuthors: updatedPersons, authorImages: personImages }
}

export async function processReviewersImages(reviewers: Person[]): Promise<{ updatedReviewers: Person[], reviewerImages: ImageFile[] }> {
  const { updatedPersons, personImages } = await processPersonsImages(reviewers, 'reviewer')
  return { updatedReviewers: updatedPersons, reviewerImages: personImages }
}

async function processPersonsImages(persons: Person[], role: 'author' | 'reviewer'): Promise<{ updatedPersons: Person[], personImages: ImageFile[] }> {
  const personImages: ImageFile[] = []
  const updatedPersons = await Promise.all(persons.map(async (person) => {
    if (!person.image || person.image === '')
      return { ...person, image: DEFAULT_AUTHOR_IMAGE }

    if (person.image.startsWith('./assets/'))
      return person

    if (!person.image.startsWith('http://') && !person.image.startsWith('https://')) {
      console.error(`The image is not an absolute URL: ${person.image}`)
      return { ...person, image: DEFAULT_AUTHOR_IMAGE }
    }

    try {
      const { webpImageName, imageContent } = await downloadAndConvertImage(person.image, `${role}-${person.name}`, AVATAR_IMAGE_MAX_WIDTH)
      const newImagePath = `./assets/${webpImageName}`
      personImages.push({ name: webpImageName, content: imageContent })
      return { ...person, image: newImagePath }
    }
    catch (error) {
      console.error(`Error processing image for ${role} ${person.name}:`, error)
      return { ...person, image: DEFAULT_AUTHOR_IMAGE }
    }
  }))
  return { updatedPersons, personImages }
}

function replaceImageLinkInMarkdown(content: string, oldUrl: string, newImageName: string): string {
  return content.replace(oldUrl, `./assets/${newImageName}`)
}
