export type HealthState = 'up' | 'down'

export interface HealthCheck {
  status: HealthState
}

export type HealthChecks = Record<string, HealthCheck>

export type HealthStatus = 'healthy' | 'unhealthy'

/**
 * The service is healthy only when at least one check ran and every check is up.
 * An empty set is treated as unhealthy: it means the probe could not assess
 * anything, which should not be reported as success.
 */
export function summarizeHealth(checks: HealthChecks): HealthStatus {
  const values = Object.values(checks)
  return values.length > 0 && values.every(check => check.status === 'up')
    ? 'healthy'
    : 'unhealthy'
}
