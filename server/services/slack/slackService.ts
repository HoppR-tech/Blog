import { WebClient } from '@slack/web-api'
import { SLACK_BOT_TOKEN, SLACK_CHANNEL_ID } from '@/server/config/slackConfig'

export class SlackService {
  private web: WebClient

  constructor() {
    if (!SLACK_BOT_TOKEN || !SLACK_CHANNEL_ID) {
      console.error('Slack configuration is incomplete')
      throw new Error('Slack configuration is incomplete')
    }
    this.web = new WebClient(SLACK_BOT_TOKEN)
  }

  async sendMessage(message: string): Promise<void> {
    try {
      await this.web.chat.postMessage({
        channel: SLACK_CHANNEL_ID,
        text: message,
      })
      // console.error('Message sent to Slack successfully')
    }
    catch (error) {
      console.error('Error sending message to Slack:', error)
      throw error
    }
  }
}

export const slackService = new SlackService()
