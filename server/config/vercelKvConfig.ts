import process from 'node:process'

const config = useRuntimeConfig()

export const KV_URL = process.env.KV_URL || config.kv.url
export const KV_REST_API_URL = process.env.KV_REST_API_URL || config.kv.rest_api_url
export const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || config.kv.rest_api_token
export const KV_REST_API_READ_ONLY_TOKEN = process.env.KV_REST_API_READ_ONLY_TOKEN || config.kv.rest_api_read_only_token

if (!KV_URL || !KV_REST_API_URL || !KV_REST_API_TOKEN || !KV_REST_API_READ_ONLY_TOKEN) {
  console.error('KV configuration is incomplete')
  process.exit(1)
}

