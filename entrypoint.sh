#!/bin/sh

# Helper function to load secret
load_secret() {
    local secret_name="$1"
    local env_var_name="$2"
    local secret_file="/run/secrets/$secret_name"

    if [ -f "$secret_file" ]; then
        export "$env_var_name"="$(cat "$secret_file")"
    fi
}

# Load secrets into environment variables
load_secret "notion_api_key" "NUXT_NOTION_API_KEY"
load_secret "github_private_key" "NUXT_GITHUB_PRIVATE_KEY"
load_secret "slack_bot_token" "NUXT_SLACK_BOT_TOKEN"

# Execute the passed command
exec "$@"
