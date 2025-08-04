# FIXME: bun do not support playwright
FROM mcr.microsoft.com/playwright:v1.54.2-noble
WORKDIR /app

COPY package.json tsconfig.json /app/
COPY packages/e2e /app/packages/e2e

WORKDIR /app/packages/e2e
RUN npm ci
CMD ["npm", "run", "e2e:docker"]
