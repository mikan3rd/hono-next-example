# :rocket: hono-next-example

## Tech Stack

- Common
  - [TypeScript](https://www.typescriptlang.org/)
  - [Bun](https://bun.sh/)
  - [Biome](https://biomejs.dev/)
- Backend
  - [Hono](https://hono.dev/)
  - [Swagger/OpenAPI](https://swagger.io/)

## Setup

- Install package manager **asdf**

```bash
brew install asdf
```

- Install **Bun** by asdf

```bash
asdf install
```

- Install dependencies

```bash
bun install
```

## Run

```bash
bun backend dev
```

## Format & Lint & Test

```bash
bun backend lint:fix
bun backend test
```

## Docker

```bash
docker compose build
docker compose up -d
```
