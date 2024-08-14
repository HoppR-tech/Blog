import buffer from 'node:buffer'
import { GITHUB_OWNER, GITHUB_REPO } from '@/server/config/githubConfig'

export async function uploadToGitHub(octokit: any, path: string, message: string, content: string, isBase64: boolean = false, branchName: string): Promise<void> {
  const finalContent = isBase64 ? content : buffer.Buffer.from(content).toString('base64')

  let sha: string | undefined
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      ref: branchName,
    })
    sha = data.sha
  }
  catch (error: unknown) {
    if (error instanceof Error && (error as any).status !== 404) {
      console.error('Error while retrieving file content:', error)
      throw error
    }
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
    message,
    content: finalContent,
    branch: branchName,
    sha,
  })
}
