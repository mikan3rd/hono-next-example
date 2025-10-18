# FIXME: bun do not support playwright
# https://github.com/oven-sh/bun/issues/8222
FROM mcr.microsoft.com/playwright:v1.56.1-noble
WORKDIR /app

COPY package.json tsconfig.json /app/
COPY packages/e2e /app/packages/e2e

WORKDIR /app/packages/e2e
RUN npm ci
CMD ["npm", "run", "e2e:docker"]
