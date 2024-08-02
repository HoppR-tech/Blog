import process from 'node:process'

const config = useRuntimeConfig()

export const GITHUB_OWNER = process.env.GITHUB_OWNER || config.github.owner || 'HoppR-tech'
export const GITHUB_REPO = process.env.GITHUB_REPO || config.github.repo || 'blog'
export const GITHUB_BRANCH = process.env.GITHUB_BRANCH || config.github.branch || 'main'

export const GITHUB_APP_ID = Number(process.env.GITHUB_APP_ID) || Number(config.github.appId)
export const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY || config.github.privateKey as string

if (!GITHUB_APP_ID || !GITHUB_PRIVATE_KEY) {
  console.error('GITHUB_APP_ID and GITHUB_PRIVATE_KEY must be set')
  process.exit(1)
}
