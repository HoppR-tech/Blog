import { App } from 'octokit'
import { createAppAuth } from "@octokit/auth-app";
import { GITHUB_APP_ID, GITHUB_PRIVATE_KEY } from '@/server/config/githubConfig'
import { Octokit } from 'octokit'

const app = new App({
  appId: GITHUB_APP_ID as number,
  privateKey: GITHUB_PRIVATE_KEY as string,
})

export async function getOctokit(): Promise<Octokit> {
  console.log('Generating JWT token...')
  const auth = createAppAuth({
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_PRIVATE_KEY,
  });
  const jwt = await auth({ type: "app" });
  console.log('JWT token generated successfully')
  // console.log('jwt : ', jwt)
  // console.log('GITHUB_APP_ID : ', GITHUB_APP_ID)
  // console.log('GITHUB_PRIVATE_KEY : ', GITHUB_PRIVATE_KEY)

  const installations = await app.octokit.rest.apps.listInstallations()
  if (installations.data.length === 0) {
    throw new Error("No installations found for this GitHub App")
  }
  const installationId = installations.data[0].id

  return await app.getInstallationOctokit(installationId)
}
