import { defineEventHandler } from 'h3'
import { NotionService } from '@/server/services/notion/notionService'
import { GitHubService } from '@/server/services/github/githubService'
import { getOctokit } from '@/server/services/github/octokitClient'

export default defineEventHandler(async (event) => {
  // console.log('Starting syncPosts process...')
  try {
    const notionService = new NotionService()
    // console.log('Fetching posts to publish from Notion...')
    const postsToPublish = await notionService.fetchPostsToPublishFromNotion()

    if (postsToPublish.length === 0) {
      // console.log('No articles to publish.')
      return { message: 'No articles to publish.' }
    }

    // console.log(`Found ${postsToPublish.length} posts to publish.`)

    // console.log('Initializing GitHub service...')
    const octokit = await getOctokit()
    const githubService = new GitHubService(octokit, notionService)

    // console.log('Checking GitHub access...')
    const githubAccess = await githubService.checkGitHubAccess()
    if (!githubAccess)
      throw new Error('GitHub access not authorized or incorrect configuration')

    // console.log('Publishing posts to GitHub...')
    const publishResults = await Promise.allSettled(
      postsToPublish.map(post => githubService.publishPostToGitHub(post)),
    )

    const successfulPublishes = publishResults.filter(result => result.status === 'fulfilled')
    const failedPublishes = publishResults.filter(result => result.status === 'rejected')

    if (failedPublishes.length > 0) {
      console.error(`Failed to publish ${failedPublishes.length} articles.`)
      return {
        message: '❌ Error during article synchronization',
        successCount: successfulPublishes.length,
        failCount: failedPublishes.length,
        failedPosts: failedPublishes.map((result, index) => {
          const error = (result as PromiseRejectedResult).reason
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          const post = postsToPublish[index]
          const lastValidImageUrl = errorMessage.includes('Invalid URL:')
            ? errorMessage.split('Last valid image URL:')[1].trim()
            : 'Not available'

          return `Title: "${post.title}" - ${errorMessage} - Last valid image URL: ${lastValidImageUrl}`
        }),
      }
    }

    return {
      message: '✅ Article synchronization process completed successfully',
      successCount: successfulPublishes.length,
      failCount: 0,
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
