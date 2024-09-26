import { GITHUB_BRANCH, GITHUB_OWNER, GITHUB_REPO } from '@/server/config/githubConfig'

export async function createBranch(octokit: any, branchName: string) {
  try {
    // Check if the branch already exists
    try {
      await octokit.rest.repos.getBranch({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        branch: branchName,
      })

      // If the branch exists, delete it
      await deleteBranch(octokit, branchName)
      // console.log(`Existing branch ${branchName} deleted.`)
    }
    catch (error: any) {
      // If the error is 404, the branch doesn't exist, which is normal
      if (error.status !== 404)
        throw error
    }

    const { data: branches } = await octokit.rest.repos.listBranches({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
    })

    const mainBranch = branches.find((branch: { name: string }) => branch.name === GITHUB_BRANCH)
    if (!mainBranch || !mainBranch.commit || !mainBranch.commit.sha)
      throw new Error(`Main branch ${GITHUB_BRANCH} does not exist or is missing commit information`)

    await octokit.rest.git.createRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: `refs/heads/${branchName}`,
      sha: mainBranch.commit.sha,
    })

    // console.log(`Branch ${branchName} created successfully.`)
  }
  catch (error) {
    console.error(`Error creating branch ${branchName}:`, error)
    throw new Error(`Unable to create branch ${branchName}: ${error instanceof Error ? error.message : 'An unknown error occurred'}`)
  }
}

export async function deleteBranch(octokit: any, branchName: string) {
  try {
    await octokit.rest.git.deleteRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: `heads/${branchName}`,
    })
  }
  catch (error) {
    console.error(`Error deleting branch ${branchName}:`, error)
    throw new Error(`Unable to delete branch ${branchName}: ${error instanceof Error ? error.message : 'An unknown error occurred'}`)
  }
}
