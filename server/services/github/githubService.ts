import type { Octokit } from 'octokit'
import type { NotionService } from '@/server/services/notion/notionService'
import type { BlogPost } from '@/types/blog'
import { GITHUB_OWNER, GITHUB_REPO } from '@/server/config/githubConfig'
import { createFolderName } from '@/utils/stringUtils'
import { createBranch, deleteBranch, safeDeleteBranch } from './branchManager'
import { uploadToGitHub } from './contentUploader'
import { uploadAllImages, uploadCoverImage } from './imageUploader'
import { checkPost } from './postChecker'
import { closePullRequestsForBranch, createPullRequest, mergePullRequest } from './pullRequestManager'

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
    const currentDate = new Date().toISOString().split('T')[0]
    const folderName = createFolderName(currentDate, post.title)
    const folderPath = `content/blogs/${folderName}`
    const assetsFolderPath = `${folderPath}/assets`
    const filePath = `${folderPath}/index.md`
    const branchName = `article/${folderName}`

    await createBranch(this.octokit, branchName)

    let branchMerged = false
    try {
      const { updatedContent, imageFiles } = await this.notionService.extractImagesAndUpdateContent(post.content)

      checkPost(post)

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
      branchMerged = true
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
    finally {
      if (!branchMerged) {
        await closePullRequestsForBranch(this.octokit, branchName)
        await safeDeleteBranch(this.octokit, branchName)
      }
    }
  }
}
