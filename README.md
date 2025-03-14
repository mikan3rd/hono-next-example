# :rocket: hono-next-example

## Tech Stack

- Common
  - [TypeScript](https://www.typescriptlang.org/)
  - [Bun](https://bun.sh/)
  - [Biome](https://biomejs.dev/)
- Backend
  - [Hono](https://hono.dev/)
  - [Swagger/OpenAPI](https://swagger.io/)
- Frontend
  - [Next.js](https://nextjs.org/)

## Setup

- Install package manager **asdf**

```bash
brew install asdf
```

- Install JavaScript runtime **Bun** by asdf

```bash
asdf install
```

- Install dependencies by Bun

```bash
bun install-all
```

## Environment Variables

- Create `.env` file in the root directory, refer to `.env.example`
- Otherwise an error will occur when running the development server

## Run development server

```bash
bun backend dev
bun frontend dev --port 4300
```

## Format & Lint & Test

```bash
bun backend lint:fix
bun backend test
```

## Run Production by Docker

```bash
docker compose build
docker compose up -d
```

## Generate OpenAPI JSON

```bash
bun run export-openapi
```
