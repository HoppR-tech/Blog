import { describe, expect, it } from 'bun:test'
import { summarizeHealth } from './health'

describe('summarizeHealth', () => {
  it('is healthy when every check is up', () => {
    expect(summarizeHealth({ contentDb: { status: 'up' } })).toBe('healthy')
    expect(summarizeHealth({ a: { status: 'up' }, b: { status: 'up' } })).toBe('healthy')
  })

  it('is unhealthy when any check is down', () => {
    expect(summarizeHealth({ contentDb: { status: 'down' } })).toBe('unhealthy')
    expect(summarizeHealth({ a: { status: 'up' }, b: { status: 'down' } })).toBe('unhealthy')
  })

  it('is unhealthy when no check ran', () => {
    expect(summarizeHealth({})).toBe('unhealthy')
  })
})
