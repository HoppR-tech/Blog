import { defineEventHandler, readBody } from 'h3'
import { slackService } from '@/server/services/slack/slackService'
import { SLACK_PUBLIC_SITE_URL } from '@/server/config/slackConfig'

// TODO: test slack message
export default defineEventHandler(async (event) => {
  const origin = event.node.req.headers.origin
  if (origin !== SLACK_PUBLIC_SITE_URL)
    return { error: 'Unauthorized' }

  const body = await readBody(event)
  const { message } = body

  try {
    await slackService.sendMessage(message)
    return { success: true }
  }
  catch (error) {
    console.error('Error sending Slack message:', error)
    return { error: 'Failed to send Slack message' }
  }
})
