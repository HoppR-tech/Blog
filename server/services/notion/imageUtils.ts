import axios from 'axios'
import sharp from 'sharp'
import { slugify } from '@/utils/stringUtils'
import type { ImageFile } from '@/types/files'
import type { Person } from '@/types/blog'

const DEFAULT_AUTHOR_IMAGE = '/default-author-image.webp'

interface ConvertedImage {
  webpImageName: string
  imageContent: string
}

export async function downloadAndConvertImage(imageUrl: string, imageName: string): Promise<ConvertedImage> {
  try {
    if (imageUrl.startsWith('./'))
      throw new Error(`The URL is a relative path: ${imageUrl}`)

    // console.log(`Attempting to download image from URL: ${imageUrl}`)
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer', maxRedirects: 0 })
    const slugifiedImageName = slugify(imageName)
    const webpImageName = `${slugifiedImageName}.webp`

    // console.log(`Successfully downloaded image. Converting to WebP: ${webpImageName}`)
    const webpBuffer = await sharp(response.data)
      .webp({ quality: 80 })
      .toBuffer()

    // console.log(`Image successfully converted to WebP: ${webpImageName}`)
    return { webpImageName, imageContent: webpBuffer.toString('base64') }
  }
  catch (error) {
    console.error(`Error while processing image ${imageUrl}:`, error)
    throw new Error(`Error while processing image ${imageUrl}: ${(error as Error).message}`)
  }
}

export async function extractImagesAndUpdateContent(content: string): Promise<{ updatedContent: string; imageFiles: ImageFile[]; lastValidImageUrl: string | null }> {
  const imageRegex = /!\[.*?\]\((.*?)\)/g
  const imageUrls = content.match(imageRegex)?.map(match => match.match(/\((.*?)\)/)?.[1]) || []
  const imageFiles: ImageFile[] = []
  let updatedContent = content
  let imageCounter = 1
  let lastValidImageUrl: string | null = null

  for (const imageUrl of imageUrls) {
    if (imageUrl) {
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
      }
    }
  }
  return { updatedContent, imageFiles, lastValidImageUrl }
}

export async function processAuthorsImages(authors: Person[]): Promise<{ updatedAuthors: Person[]; authorImages: ImageFile[] }> {
  const authorImages: ImageFile[] = []
  const updatedAuthors = await Promise.all(authors.map(async (author) => {
    if (!author.image || author.image === '')
      return { ...author, image: DEFAULT_AUTHOR_IMAGE }

    if (author.image.startsWith('./assets/'))
      return author

    if (!author.image.startsWith('http://') && !author.image.startsWith('https://')) {
      console.error(`The image is not an absolute URL: ${author.image}`)
      return { ...author, image: DEFAULT_AUTHOR_IMAGE }
    }

    try {
      const { webpImageName, imageContent } = await downloadAndConvertImage(author.image, `author-${author.name}`)
      const newImagePath = `./assets/${webpImageName}`
      authorImages.push({ name: webpImageName, content: imageContent })
      return { ...author, image: newImagePath }
    }
    catch (error) {
      console.error(`Error processing image for author ${author.name}:`, error)
      return { ...author, image: DEFAULT_AUTHOR_IMAGE }
    }
  }))
  return { updatedAuthors, authorImages }
}

function replaceImageLinkInMarkdown(content: string, oldUrl: string, newImageName: string): string {
  return content.replace(oldUrl, `./assets/${newImageName}`)
}
