// This file is used to setup vitest
import { vi } from 'vitest'

interface GlobalWithVitest {
  vi: typeof vi
  useRuntimeConfig: () => {
    github: { owner: string, repo: string, branch: string, appId: string, privateKey: string }
    notion: { apiKey: string, databasePostsId: string }
    slack: { botToken: string, channelId: string }
    public: { baseUrl: string, contactEmail: string, contactName: string }
  }
}

// Make vi.mock work with bun
const g = globalThis as unknown as GlobalWithVitest
g.vi = vi

// Provide useRuntimeConfig global for server modules that call it at top-level
g.useRuntimeConfig = () => ({
  github: { owner: '', repo: '', branch: '', appId: '', privateKey: '' },
  notion: { apiKey: '', databasePostsId: '' },
  slack: { botToken: '', channelId: '' },
  public: { baseUrl: '', contactEmail: '', contactName: '' },
})
