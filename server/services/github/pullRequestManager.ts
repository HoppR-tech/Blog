import { GITHUB_BRANCH, GITHUB_OWNER, GITHUB_REPO } from '@/server/config/githubConfig'

export async function createPullRequest(octokit: any, branchName: string, title: string) {
  try {
    const { data: pullRequest } = await octokit.rest.pulls.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title,
      head: branchName,
      base: GITHUB_BRANCH,
      body: 'This article has been automatically published from Notion.',
    })
    return pullRequest
  }
  catch (error: any) {
    console.error('Error creating pull request:', error)
    throw new Error(`Unable to create pull request: ${error.message}`)
  }
}

export async function mergePullRequest(octokit: any, pullNumber: number) {
  await octokit.rest.pulls.merge({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    pull_number: pullNumber,
    merge_method: 'squash',
  })
}

export async function closePullRequestsForBranch(octokit: any, branchName: string): Promise<void> {
  try {
    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      head: `${GITHUB_OWNER}:${branchName}`,
      state: 'open',
    })

    for (const pr of pullRequests) {
      try {
        await octokit.rest.pulls.update({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          pull_number: pr.number,
          state: 'closed',
        })
      }
      catch (error) {
        console.error(`Failed to close PR #${pr.number} for branch ${branchName}:`, error)
      }
    }
  }
  catch (error) {
    console.error(`Failed to list/close PRs for branch ${branchName}:`, error)
  }
}
