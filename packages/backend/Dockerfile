# ref: https://bun.sh/guides/ecosystem/docker

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.4 AS base
WORKDIR /usr/src/app

# install with --production (exclude devDependencies)
FROM base AS install
COPY package.json bun.lock /usr/src/app/
RUN bun install --frozen-lockfile --production

# copy production dependencies and source code into final image
FROM base AS release
ENV NODE_ENV="production"
ENV APP_PORT="4300"
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .

# run the app
USER bun
EXPOSE ${APP_PORT}/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
