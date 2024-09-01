import { defineEventHandler } from 'h3'
import { NotionService } from '@/server/services/notion/notionService'
import { GitHubService } from '@/server/services/github/githubService'
import { getOctokit } from '@/server/services/github/octokitClient'

export default defineEventHandler(async (event) => {
  console.log('Starting syncPosts process...')
  try {
    const notionService = new NotionService()
    console.log('Fetching posts to publish from Notion...')
    const postsToPublish = await notionService.fetchPostsToPublishFromNotion()

    if (postsToPublish.length === 0) {
      console.log('No articles to publish.')
      return { message: 'No articles to publish.' }
    }

    console.log(`Found ${postsToPublish.length} posts to publish.`)

    console.log('Initializing GitHub service...')
    const octokit = await getOctokit()
    const githubService = new GitHubService(octokit, notionService)

    console.log('Checking GitHub access...')
    const githubAccess = await githubService.checkGitHubAccess()
    if (!githubAccess) {
      throw new Error('GitHub access not authorized or incorrect configuration')
    }

    console.log('Publishing posts to GitHub...')
    const publishResults = await Promise.allSettled(
      postsToPublish.map(post => githubService.publishPostToGitHub(post))
    )

    const successfulPublishes = publishResults.filter(result => result.status === 'fulfilled')
    const failedPublishes = publishResults.filter(result => result.status === 'rejected')

    console.log(`Successfully published ${successfulPublishes.length} posts.`)
    if (failedPublishes.length > 0) {
      console.error(`Failed to publish ${failedPublishes.length} posts.`)
    }

    return {
      message: '✅ Articles synchronization process completed',
      successCount: successfulPublishes.length,
      failCount: failedPublishes.length,
      failedPosts: failedPublishes.map(result => (result as PromiseRejectedResult).reason.message)
    }
  }
  catch (error) {
    console.error('❌ Error during syncPosts process:', error)
    return {
      error: true,
      message: '❌ Error during articles synchronization process',
      details: error instanceof Error ? error.message : 'An unknown error occurred'
    }
  }
})
