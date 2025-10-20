# :rocket: hono-next-example

## Tech Stack

- Common
  - [TypeScript](https://www.typescriptlang.org/)
  - [Bun](https://bun.sh/)
  - [Biome](https://biomejs.dev/)
  - [Zod](https://zod.dev/)
  - [JS-Temporal](https://github.com/tc39/proposal-temporal)
- Backend
  - [Hono](https://hono.dev/)
  - [Swagger/OpenAPI](https://swagger.io/)
  - [Drizzle ORM](https://orm.drizzle.team/)
  - [Supabase](https://supabase.com/)
- Frontend
  - [Next.js](https://nextjs.org/)
  - [Tailwind CSS](https://tailwindcss.com)
  - [Shadcn UI](https://ui.shadcn.com)
  - [Tanstack Query](https://tanstack.com/query/latest)
- E2E
  - [Playwright](https://playwright.dev/)
  - [Chromatic](https://www.chromatic.com/)

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

### Environment Variables

- Create `.env` file in the root directory, refer to `.env.example`
- Otherwise an error will occur when running the development server

## Run development server

```bash
bun backend dev
bun frontend dev --port 4400
```

### Format & Lint & Test

```bash
bun backend lint:fix
bun backend test
```

## Run by Docker

### Development Server

```bash
cd docker

docker compose build
docker compose -f docker-compose.yml up -d
```

### Production

```bash
cd docker

docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

## Generate OpenAPI JSON

```bash
bun run export-openapi
```
