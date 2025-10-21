FROM oven/bun:1.2.23 AS base

FROM mcr.microsoft.com/playwright:v1.55.1-noble
WORKDIR /app

COPY --from=base /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock /app/
COPY packages/backend_app/package.json /app/packages/backend_app/
COPY packages/frontend_app/package.json /app/packages/frontend_app/
COPY packages/e2e/package.json /app/packages/e2e/
RUN bun install --frozen-lockfile --filter e2e

COPY package.json tsconfig.json /app/
COPY packages/e2e /app/packages/e2e

WORKDIR /app/packages/e2e
CMD ["bun", "run", "e2e:docker"]
