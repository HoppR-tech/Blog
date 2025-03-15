import process from 'node:process'

// Déterminer si nous sommes en développement
const isDev = process.env.NODE_ENV === 'development'

// Utiliser des valeurs factices pour le développement local
export const REDIS_URL = process.env.REDIS_URL || (isDev ? 'redis://localhost:6379' : '')
export const REDIS_REST_API_URL = process.env.REDIS_REST_API_URL || (isDev ? 'https://example.upstash.io' : '')
export const REDIS_REST_API_TOKEN = process.env.REDIS_REST_API_TOKEN || (isDev ? 'dummy_token' : '')
export const REDIS_REST_API_READ_ONLY_TOKEN = process.env.REDIS_REST_API_READ_ONLY_TOKEN || (isDev ? 'dummy_read_token' : '')

// En développement, ne pas quitter même si la configuration est incomplète
if (!isDev && (!REDIS_URL || !REDIS_REST_API_URL || !REDIS_REST_API_TOKEN || !REDIS_REST_API_READ_ONLY_TOKEN)) {
  console.error('REDIS configuration is incomplete')
  process.exit(1)
}
