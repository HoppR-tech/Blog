# Use the official Bun image
# See all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# --- Stage 1: Install dependencies ---
FROM base AS install

# better-sqlite3 requires native build tools — cached as separate layer
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install dev dependencies (for build)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# --- Stage 2: Build application ---
FROM base AS build
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .

ENV NODE_ENV=production
ENV NITRO_PRESET=bun
ENV NITRO_BUN_IDLE_TIMEOUT=300
RUN bun run build

# --- Stage 3: Production image (minimal) ---
FROM base AS release

# Only copy what's needed at runtime
COPY --from=build /usr/src/app/.output .output
COPY --from=build /usr/src/app/content/blogs content/blogs
COPY --from=build /usr/src/app/package.json .
COPY entrypoint.sh .

USER root
RUN chmod +x entrypoint.sh
USER bun

EXPOSE 3000/tcp
ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "bun", "run", ".output/server/index.mjs" ]
