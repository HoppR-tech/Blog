import { createBranch, deleteBranch } from './branchManager'
import { createPullRequest, mergePullRequest } from './pullRequestManager'
import { uploadAllImages, uploadCoverImage } from './imageUploader'
import { uploadToGitHub } from './contentUploader'
import type { OctokitInterface } from '@/types/github'
import { createFolderName } from '@/utils/stringUtils'
import type { BlogPost } from '@/types/blog'
import type { NotionService } from '@/server/services/notion/notionService'

export class GitHubService {
  constructor(
    private octokit: OctokitInterface,
    private notionService: NotionService,
  ) {}

  async publishPostToGitHub(post: BlogPost) {
    const currentDate = new Date().toISOString().split('T')[0]
    const folderName = createFolderName(currentDate, post.title)
    const folderPath = `content/blogs/${folderName}`
    const assetsFolderPath = `${folderPath}/assets`
    const filePath = `${folderPath}/index.md`
    const branchName = `article/${folderName}`

    try {
      await createBranch(this.octokit, branchName)

      const { updatedContent, imageFiles } = await this.notionService.extractImagesAndUpdateContent(post.content)

      if (!post.image)
        throw new Error('Cover image is missing.')

      let updatedPost: BlogPost = { ...post, ...await uploadCoverImage(this.octokit, post, assetsFolderPath, branchName) }

      const { updatedAuthors, authorImages } = await this.notionService.processAuthorsImages(post.authors)

      await uploadAllImages(this.octokit, imageFiles, assetsFolderPath, branchName)
      await uploadAllImages(this.octokit, authorImages, assetsFolderPath, branchName)

      updatedPost = {
        ...updatedPost,
        authors: updatedAuthors,
      }

      const markdownContent = this.notionService.generateMarkdownContent(updatedPost, updatedContent)
      await uploadToGitHub(this.octokit, filePath, `Upload post: ${post.title}`, markdownContent, false, branchName)

      const pullRequest = await createPullRequest(this.octokit, branchName, `Publish article: ${post.title}`)
      await mergePullRequest(this.octokit, pullRequest.number)
      await deleteBranch(this.octokit, branchName)

      await this.notionService.updatePostStatusInNotion(post.notionId, 'Publié')
      await this.notionService.updatePublishedDateInNotion(post.notionId)
    }
    catch (error) {
      console.error(`Error while publishing post "${post.title}" to GitHub:`, error)
      throw error
    }
  }
}
