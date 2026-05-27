import type { BlogPost, Person } from '@/types/blog'
import type { ImageFile } from '@/types/files'
import { downloadAndConvertImage, extractImagesAndUpdateContent, processAuthorsImages, processReviewersImages } from './imageUtils'
import { generateMarkdownContent } from './markdownGenerator'
import { getNotionClient } from './notionClient'
import { type FetchPostsResult, fetchPostsToPublish, updatePostStatus, updatePublishedDate } from './postRepository'

export class NotionService {
  private notionClient = getNotionClient()

  async fetchPostsToPublishFromNotion(): Promise<FetchPostsResult> {
    return await fetchPostsToPublish(this.notionClient)
  }

  async updatePostStatusInNotion(pageId: string, newStatus: string): Promise<void> {
    await updatePostStatus(this.notionClient, pageId, newStatus)
  }

  async updatePublishedDateInNotion(pageId: string): Promise<void> {
    await updatePublishedDate(this.notionClient, pageId)
  }

  async downloadAndConvertImage(imageUrl: string, imageName: string): Promise<{ webpImageName: string, imageContent: string }> {
    return await downloadAndConvertImage(imageUrl, imageName)
  }

  async extractImagesAndUpdateContent(content: string): Promise<{ updatedContent: string, imageFiles: ImageFile[], lastValidImageUrl: string | null }> {
    return await extractImagesAndUpdateContent(content)
  }

  async processAuthorsImages(authors: Person[]): Promise<{ updatedAuthors: Person[], authorImages: ImageFile[] }> {
    return await processAuthorsImages(authors)
  }

  async processReviewersImages(reviewers: Person[]): Promise<{ updatedReviewers: Person[], reviewerImages: ImageFile[] }> {
    return await processReviewersImages(reviewers)
  }

  generateMarkdownContent(post: BlogPost, content: string): string {
    return generateMarkdownContent(post, content)
  }
}
