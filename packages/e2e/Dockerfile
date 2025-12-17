FROM oven/bun:1.3.3 AS base

FROM mcr.microsoft.com/playwright:v1.56.1-noble
WORKDIR /app

COPY --from=base /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock /app/
COPY packages/*/package.json /app/packages/
RUN bun install --frozen-lockfile --filter e2e

COPY package.json tsconfig.json /app/
COPY packages/e2e /app/packages/e2e

WORKDIR /app/packages/e2e
CMD ["bun", "run", "e2e:docker"]
