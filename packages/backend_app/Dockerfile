# ref: https://bun.sh/guides/ecosystem/docker

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.10 AS base
WORKDIR /app

# install with --production (exclude devDependencies)
FROM base AS install
COPY package.json bun.lock /app/
COPY packages/backend_app/package.json /app/packages/backend_app/
COPY packages/frontend_app/package.json /app/packages/frontend_app/
RUN bun install --frozen-lockfile --production --filter backend_app

# copy production dependencies and source code into final image
FROM base AS release
ENV NODE_ENV="production"
ENV BACKEND_APP_PORT="4300"
COPY --from=install /app/node_modules node_modules
COPY package.json tsconfig.json /app/
COPY packages/backend_app /app/packages/backend_app

# run the app
WORKDIR /app/packages/backend_app
USER bun
EXPOSE ${BACKEND_APP_PORT}/tcp
ENTRYPOINT [ "bun", "run", "src/server.ts" ]


FROM base AS dev
COPY package.json bun.lock /app/
COPY packages/backend_app/package.json /app/packages/backend_app/
COPY packages/frontend_app/package.json /app/packages/frontend_app/
RUN bun install --frozen-lockfile
WORKDIR /app/packages/backend_app
