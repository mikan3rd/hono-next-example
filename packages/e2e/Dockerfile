FROM oven/bun:1.2.19
WORKDIR /app

COPY package.json bun.lock /app/
COPY packages/backend_app/package.json /app/packages/backend_app/
COPY packages/frontend_app/package.json /app/packages/frontend_app/
COPY packages/e2e/package.json /app/packages/e2e/
RUN bun install --frozen-lockfile --filter e2e
RUN bunx playwright install --with-deps

CMD [ "bun", "run", "e2e" ]
