# ref: https://bun.sh/guides/ecosystem/docker
# ref: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.22 AS base
WORKDIR /app
ARG NEXT_PUBLIC_BACKEND_APP_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BACKEND_APP_URL=${NEXT_PUBLIC_BACKEND_APP_URL}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}
ENV FRONTEND_APP_PORT="4400"

# copy production dependencies and source code into final image
FROM base AS builder
COPY package.json bun.lock /app/
COPY packages/backend_app/package.json /app/packages/backend_app/
COPY packages/frontend_app/package.json /app/packages/frontend_app/
RUN bun install --frozen-lockfile --production --filter frontend_app
COPY package.json tsconfig.json /app/
COPY packages/frontend_app /app/packages/frontend_app
WORKDIR /app/packages/frontend_app
RUN bun next:build

# run the app
FROM base AS runner
ENV NODE_ENV="production"
ENV PORT=${FRONTEND_APP_PORT}

# If you use bun workspace, a workspace will be created under .next/standalone
COPY --from=builder /app/packages/frontend_app/.next/standalone ./

# Copy static files to workspace
COPY --from=builder /app/packages/frontend_app/public ./packages/frontend_app/public
COPY --from=builder /app/packages/frontend_app/.next/static ./packages/frontend_app/.next/static

EXPOSE ${FRONTEND_APP_PORT}
WORKDIR /app/packages/frontend_app
ARG HOSTNAME
ENV HOSTNAME=${HOSTNAME}
ENTRYPOINT [ "bun", "run", "server.js" ]


FROM base AS dev
COPY package.json bun.lock /app/
COPY packages/backend_app/package.json /app/packages/backend_app/
COPY packages/frontend_app/package.json /app/packages/frontend_app/
RUN bun install --frozen-lockfile
WORKDIR /app/packages/frontend_app
