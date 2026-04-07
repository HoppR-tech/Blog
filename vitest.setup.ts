// This file is used to setup vitest
import { vi } from 'vitest'

// Make vi.mock work with bun
global.vi = vi

// Provide useRuntimeConfig global for server modules that call it at top-level
;(globalThis as any).useRuntimeConfig = () => ({
  github: { owner: '', repo: '', branch: '', appId: '', privateKey: '' },
  notion: { apiKey: '', databasePostsId: '' },
  slack: { botToken: '', channelId: '' },
  public: { baseUrl: '', contactEmail: '', contactName: '' },
})
