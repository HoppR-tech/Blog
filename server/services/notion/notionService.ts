import { getNotionClient } from './notionClient'
import { fetchPostsToPublish, updatePostStatus, updatePublishedDate } from './postRepository'
import { downloadAndConvertImage, extractImagesAndUpdateContent, processAuthorsImages } from './imageUtils'
import { generateMarkdownContent } from './markdownGenerator'
import type { BlogPost } from '@/types/blog'
import type { ImageFile } from '@/types/files'

export class NotionService {
  private notionClient = getNotionClient()

  async fetchPostsToPublishFromNotion(): Promise<BlogPost[]> {
    return await fetchPostsToPublish(this.notionClient)
  }

  async updatePostStatusInNotion(pageId: string, newStatus: string): Promise<void> {
    await updatePostStatus(this.notionClient, pageId, newStatus)
  }

  async updatePublishedDateInNotion(pageId: string): Promise<void> {
    await updatePublishedDate(this.notionClient, pageId)
  }

  async downloadAndConvertImage(imageUrl: string, imageName: string): Promise<{ webpImageName: string; imageContent: string }> {
    return await downloadAndConvertImage(imageUrl, imageName)
  }

  async extractImagesAndUpdateContent(content: string): Promise<{ updatedContent: string; imageFiles: ImageFile[] }> {
    return await extractImagesAndUpdateContent(content)
  }

  async processAuthorsImages(authors: any[]): Promise<{ updatedAuthors: any[]; authorImages: ImageFile[] }> {
    return await processAuthorsImages(authors)
  }

  generateMarkdownContent(post: BlogPost, content: string): string {
    return generateMarkdownContent(post, content)
  }
}
