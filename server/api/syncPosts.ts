import { defineEventHandler } from 'h3'
import { GitHubService } from '@/server/services/github/githubService'
import { getOctokit } from '@/server/services/github/octokitClient'
import { NotionService } from '@/server/services/notion/notionService'

export default defineEventHandler(async (event) => {
  // console.log('Starting syncPosts process...')
  try {
    const notionService = new NotionService()
    const { posts: postsToPublish, skippedErrors } = await notionService.fetchPostsToPublishFromNotion()

    if (postsToPublish.length === 0 && skippedErrors.length === 0) {
      return { message: 'No articles to publish.' }
    }

    if (postsToPublish.length === 0 && skippedErrors.length > 0) {
      return {
        message: '❌ All articles were skipped due to validation errors',
        skippedCount: skippedErrors.length,
        skippedArticles: skippedErrors,
      }
    }

    const octokit = await getOctokit()
    const githubService = new GitHubService(octokit, notionService)

    const githubAccess = await githubService.checkGitHubAccess()
    if (!githubAccess)
      throw new Error('GitHub access not authorized or incorrect configuration')

    const publishResults: PromiseSettledResult<void>[] = []

    for (const post of postsToPublish) {
      try {
        await githubService.publishPostToGitHub(post)
        publishResults.push({ status: 'fulfilled', value: undefined })
      }
      catch (error) {
        console.error(`Failed to publish post "${post.title}":`, error)
        publishResults.push({ status: 'rejected', reason: error })
      }
    }

    const successfulPublishes = publishResults.filter(result => result.status === 'fulfilled')
    const failedPublishes = publishResults.filter(result => result.status === 'rejected')

    if (failedPublishes.length > 0 || skippedErrors.length > 0) {
      return {
        message: '❌ Error during article synchronization',
        successCount: successfulPublishes.length,
        failCount: failedPublishes.length,
        skippedCount: skippedErrors.length,
        failedPosts: failedPublishes.map((result, index) => {
          const error = (result as PromiseRejectedResult).reason
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          const post = postsToPublish[index]
          const postTitle = post?.title ?? 'Unknown'
          const lastValidImageUrl = errorMessage.includes('Invalid URL:')
            ? errorMessage.split('Last valid image URL:')[1]?.trim() ?? 'Not available'
            : 'Not available'

          return `Title: "${postTitle}" - ${errorMessage} - Last valid image URL: ${lastValidImageUrl}`
        }),
        skippedArticles: skippedErrors,
      }
    }

    return {
      message: '✅ Article synchronization process completed successfully',
      successCount: successfulPublishes.length,
      failCount: 0,
      skippedCount: skippedErrors.length,
      skippedArticles: skippedErrors.length > 0 ? skippedErrors : undefined,
    }
  }
  catch (error) {
    console.error('❌ Error during syncPosts process:', error)
    return {
      message: '❌ Error during article synchronization',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})
