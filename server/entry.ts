
// @ts-ignore
import { useNitroApp } from '#internal/nitro/app'

const nitroApp = useNitroApp()

const port = process.env.PORT ? Number(process.env.PORT) : 3000

const server = Bun.serve({
  port,
  fetch: nitroApp.localFetch,
  idleTimeout: 300, // 5 minutes
  websocket: {
    ...nitroApp.hooks.callHookWith((hooks: any) => hooks['bun:websocket:init']),
    ...nitroApp.h3App.websocket,
  }
})

console.log(`Listening on http://localhost:${server.port}...`)
