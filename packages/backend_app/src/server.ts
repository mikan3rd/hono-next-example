import { app } from "./apps";
import { db } from "./db";
import { env } from "./env";

const server = Bun.serve({
  port: env.BACKEND_APP_PORT,
  fetch: app.fetch,
  development: false,
  idleTimeout: 30,
});

const shutdown = async () => {
  console.info("shutdown event");

  await db.$client.end();
  console.info("database connection closed");

  await server.stop();
  console.info("server stopped");

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.info(`Server is running on ${server.url.toString()}`);
