# ref: https://bun.sh/guides/ecosystem/docker

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.4 AS base
WORKDIR /app

# install with --production (exclude devDependencies)
FROM base AS install
COPY package.json bun.lock /app/
RUN bun install --frozen-lockfile --production

# copy production dependencies and source code into final image
FROM base AS release
ENV NODE_ENV="production"
ENV BACKEND_APP_PORT="4300"
COPY --from=install /app/node_modules node_modules
COPY . /app/

# run the app
USER bun
EXPOSE ${BACKEND_APP_PORT}/tcp
ENTRYPOINT [ "bun", "run", "src/server.ts" ]
