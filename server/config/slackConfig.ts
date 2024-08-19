import process from 'node:process'

const config = useRuntimeConfig()

interface SlackConfig {
  botToken: string
  channelId: string
}

const slackConfig = config.slack as SlackConfig

export const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || slackConfig.botToken
export const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID || slackConfig.channelId
export const SLACK_PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL || config.public.baseUrl

if (!SLACK_BOT_TOKEN) {
  console.error('SLACK_BOT_TOKEN is not defined')
  process.exit(1)
}

if (!SLACK_CHANNEL_ID) {
  console.error('SLACK_CHANNEL_ID is not defined')
  process.exit(1)
}

if (!SLACK_PUBLIC_SITE_URL) {
  console.error('NUXT_PUBLIC_SITE_URL is not defined')
  process.exit(1)
}
