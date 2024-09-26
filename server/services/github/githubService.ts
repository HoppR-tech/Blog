import type { Octokit } from 'octokit'
import { createBranch, deleteBranch } from './branchManager'
import { createPullRequest, mergePullRequest } from './pullRequestManager'
import { uploadAllImages, uploadCoverImage } from './imageUploader'
import { uploadToGitHub } from './contentUploader'
import { createFolderName } from '@/utils/stringUtils'
import type { BlogPost } from '@/types/blog'
import type { NotionService } from '@/server/services/notion/notionService'
import { GITHUB_OWNER, GITHUB_REPO } from '@/server/config/githubConfig'

export class GitHubService {
  constructor(
    private octokit: Octokit,
    private notionService: NotionService,
  ) {}

  async checkGitHubAccess() {
    try {
      // console.log('Checking GitHub access...')
      const { data: appData } = await this.octokit.rest.apps.getAuthenticated()
      // console.log('Application data:', appData)

      const { data: repoData } = await this.octokit.rest.repos.get({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
      })
      // console.log('Repository access confirmed:', repoData.full_name)

      return true
    }
    catch (error: any) {
      console.error('Error checking GitHub access:', error.message)
      return false
    }
  }

  async publishPostToGitHub(post: BlogPost) {
    try {
      const currentDate = new Date().toISOString().split('T')[0]
      const folderName = createFolderName(currentDate, post.title)
      const folderPath = `content/blogs/${folderName}`
      const assetsFolderPath = `${folderPath}/assets`
      const filePath = `${folderPath}/index.md`
      const branchName = `article/${folderName}`

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
      if (error instanceof Error) {
        const errorMessage = error.message
        const lastValidImageUrl = (error as any).lastValidImageUrl || 'No valid image URL found'
        throw new Error(`Error while publishing article "${post.title}": ${errorMessage}. Last valid image URL: ${lastValidImageUrl}`)
      }
      else {
        throw new TypeError(`Unknown error while publishing article "${post.title}"`)
      }
    }
  }
}
