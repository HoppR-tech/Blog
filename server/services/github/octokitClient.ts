import { App } from 'octokit'
import { GITHUB_APP_ID, GITHUB_PRIVATE_KEY } from '@/server/config/githubConfig'
import type { OctokitInterface } from '@/types/github'

const app = new App({
  appId: GITHUB_APP_ID as number,
  privateKey: GITHUB_PRIVATE_KEY as string,
})

export async function getOctokit(appId: number): Promise<OctokitInterface> {
  return await app.getInstallationOctokit(appId)
}
