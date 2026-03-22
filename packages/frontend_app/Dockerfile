# ref: https://bun.sh/guides/ecosystem/docker
# ref: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM oven/bun:1.3.10 AS base
WORKDIR /app
ARG NEXT_PUBLIC_BACKEND_APP_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BACKEND_APP_URL=${NEXT_PUBLIC_BACKEND_APP_URL}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}
ENV FRONTEND_APP_PORT="4400"

FROM base AS builder
COPY package.json bun.lock /app/
COPY packages/backend_app/package.json /app/packages/backend_app/
COPY packages/frontend_app/package.json /app/packages/frontend_app/
COPY packages/e2e/package.json /app/packages/e2e/
RUN bun install --frozen-lockfile --production --filter frontend_app
COPY tsconfig.json /app/
COPY packages/backend_app/openapi.json /app/packages/backend_app/openapi.json
COPY packages/frontend_app /app/packages/frontend_app
WORKDIR /app/packages/frontend_app
RUN bun run gen:client
RUN bun next:build

FROM base AS runner
ENV NODE_ENV="production"
ENV PORT=${FRONTEND_APP_PORT}

COPY --from=builder /app/packages/frontend_app/.next/standalone ./

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
COPY packages/e2e/package.json /app/packages/e2e/
COPY packages/backend_app/openapi.json /app/packages/backend_app/openapi.json
RUN bun install --frozen-lockfile
COPY tsconfig.json /app/
COPY packages/frontend_app /app/packages/frontend_app
WORKDIR /app/packages/frontend_app
RUN bun run gen:client
