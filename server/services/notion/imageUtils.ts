import axios from 'axios'
import sharp from 'sharp'
import { slugify } from '@/utils/stringUtils'
import type { ImageFile } from '@/types/files'
import type { Person } from '@/types/blog'

interface ConvertedImage {
  webpImageName: string
  imageContent: string
}

export async function downloadAndConvertImage(imageUrl: string, imageName: string): Promise<ConvertedImage> {
  try {
    if (imageUrl.startsWith('./'))
      throw new Error(`The URL is a relative path: ${imageUrl}`)

    // console.error(`Téléchargement de l'image depuis l'URL: ${imageUrl}`)
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer', maxRedirects: 0 })
    const slugifiedImageName = slugify(imageName)
    const webpImageName = `${slugifiedImageName}.webp`

    const webpBuffer = await sharp(response.data)
      .webp({ quality: 80 })
      .toBuffer()

    return { webpImageName, imageContent: webpBuffer.toString('base64') }
  }
  catch (error) {
    console.error(`Error while downloading or converting image ${imageUrl}:`, error as Error)
    throw new Error(`Error while downloading image: ${(error as Error).message}`)
  }
}

export async function extractImagesAndUpdateContent(content: string): Promise<{ updatedContent: string; imageFiles: ImageFile[] }> {
  const imageRegex = /!\[.*?\]\((.*?)\)/g
  const imageUrls = content.match(imageRegex)?.map(match => match.match(/\((.*?)\)/)?.[1]) || []
  const imageFiles: ImageFile[] = []
  let updatedContent = content
  let imageCounter = 1

  for (const imageUrl of imageUrls) {
    if (imageUrl) {
      const imageName = `img${imageCounter}`
      const { webpImageName, imageContent } = await downloadAndConvertImage(imageUrl, imageName)
      imageFiles.push({ name: webpImageName, content: imageContent })
      updatedContent = replaceImageLinkInMarkdown(updatedContent, imageUrl, webpImageName)
      imageCounter++
    }
  }
  return { updatedContent, imageFiles }
}

export async function processAuthorsImages(authors: Person[]): Promise<{ updatedAuthors: Person[]; authorImages: ImageFile[] }> {
  const authorImages: ImageFile[] = []
  const updatedAuthors = await Promise.all(authors.map(async (author) => {
    if (author.image && !author.image.startsWith('./assets/')) {
      if (!author.image.startsWith('http://') && !author.image.startsWith('https://')) {
        console.error(`The image is not an absolute URL: ${author.image}`)
        throw new Error(`The image is not an absolute URL: ${author.image}`)
      }

      const { webpImageName, imageContent } = await downloadAndConvertImage(author.image, `author-${author.name}`)
      const newImagePath = `./assets/${webpImageName}`
      authorImages.push({ name: webpImageName, content: imageContent })
      return { ...author, image: newImagePath }
    }
    return author
  }))
  return { updatedAuthors, authorImages }
}

function replaceImageLinkInMarkdown(content: string, oldUrl: string, newImageName: string): string {
  return content.replace(oldUrl, `./assets/${newImageName}`)
}
