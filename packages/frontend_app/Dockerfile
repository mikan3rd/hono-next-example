# ref: https://bun.sh/guides/ecosystem/docker
# ref: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.4 AS base
WORKDIR /app

# install with --production (exclude devDependencies)
FROM base AS install
COPY package.json bun.lock /app/
COPY packages/backend_app/package.json /app/packages/backend_app/
COPY packages/frontend_app/package.json /app/packages/frontend_app/
RUN bun install --frozen-lockfile --production --filter './packages/frontend_app'

# copy production dependencies and source code into final image
FROM base AS builder
ENV FRONTEND_APP_PORT="4400"
COPY --from=install /app/node_modules node_modules
COPY package.json bun.lock /app/
COPY packages/frontend_app /app/packages/frontend_app
WORKDIR /app/packages/frontend_app
RUN bun --bun run build

# run the app
FROM base AS runner
ENV NODE_ENV="production"
COPY --from=builder /app/packages/frontend_app/public ./public
COPY --from=builder /app/packages/frontend_app/.next/standalone ./
COPY --from=builder /app/packages/frontend_app/.next/static ./.next/static
EXPOSE ${FRONTEND_APP_PORT}
ENTRYPOINT [ "bun", "run", "server.js" ]
