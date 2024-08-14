import { GITHUB_BRANCH, GITHUB_OWNER, GITHUB_REPO } from '@/server/config/githubConfig'

export async function createPullRequest(octokit: any, branchName: string, title: string) {
  try {
    const { data: pullRequest } = await octokit.rest.pulls.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title,
      head: branchName,
      base: GITHUB_BRANCH,
      body: 'Cet article a été automatiquement publié depuis Notion.',
    })
    return pullRequest
  }
  catch (error: any) {
    console.error('Erreur lors de la création de la pull request:', error)
    throw new Error(`Impossible de créer la pull request: ${error.message}`)
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
