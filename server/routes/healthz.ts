import type { H3Event } from 'h3'
import type { HealthChecks } from '@/utils/health'
import process from 'node:process'
import { summarizeHealth } from '@/utils/health'

// Server-side queryCollection has signature (event, collection) but auto-import
// types only expose the client-side (collection) overload.
// @ts-expect-error - Nuxt Content v3 server auto-import provides 2-arg overload at runtime
const serverQueryCollection: (event: H3Event, collection: 'blogs') => ReturnType<typeof queryCollection> = queryCollection

/**
 * Readiness probe consumed by the Docker Swarm healthcheck.
 *
 * It verifies the one dependency the blog needs to serve traffic: the Nuxt
 * Content SQLite database (queryCollection). That database is exactly what
 * crash-looped on EACCES, so probing it catches the failure the homepage probe
 * would have missed.
 *
 * External services (Notion / GitHub / Slack) are intentionally NOT probed: they
 * are only used for content sync, never to render the site, so depending on them
 * here would mark healthy replicas as down whenever a third party is unavailable.
 *
 * Returns 200 + JSON when healthy, 503 when not. Error details are logged
 * server-side only — never leaked in the public response.
 */
export default defineEventHandler(async (event) => {
  const startedAt = Date.now()

  setResponseHeaders(event, {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Type': 'application/json; charset=utf-8',
  })

  const checks: HealthChecks = {}

  try {
    // A single read is enough to confirm the DB is reachable and queryable.
    await serverQueryCollection(event, 'blogs').first()
    checks.contentDb = { status: 'up' }
  }
  catch (error) {
    checks.contentDb = { status: 'down' }
    console.error('[healthz] content DB check failed:', error)
  }

  const status = summarizeHealth(checks)
  if (status !== 'healthy') {
    setResponseStatus(event, 503)
  }

  return {
    status,
    uptimeSeconds: Math.round(process.uptime()),
    durationMs: Date.now() - startedAt,
    checks,
  }
})
