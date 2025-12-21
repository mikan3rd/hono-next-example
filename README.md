# :rocket: hono-next-example

- [Chromatic Library](https://www.chromatic.com/library?appId=68b4d2ddc7b859a68b164a43)
- [Storybook](https://main--68b4d2ddc7b859a68b164a43.chromatic.com)

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

### Environment Variables

- Create `.env` file in the docker directory, refer to `.env.example`
- Otherwise an error will occur when running the development server

## Run by Docker

### Development Server

```bash
cd docker

docker compose build
docker compose up -d
```

### Production

```bash
cd docker

docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

## Run by local

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
bun install
```

### Format & Lint & Test

```bash
cd packages/backend_app
bun check:all

cd packages/frontend_app
bun check:all
```
