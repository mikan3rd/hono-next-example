import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  runtimeEnv: process.env,

  server: {
    BACKEND_APP_PORT: z.coerce.number().min(1),
    DATABASE_HOST: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_PORT: z.coerce.number().min(1),
    SUPABASE_URL: z.url(),
    SUPABASE_KEY: z.string(),
    ENABLE_DB_INITIALIZE: z
      .enum(["true", "false"])
      .default("false")
      .transform((val) => val === "true"),
  },
});

export const DATABASE_URL = `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.DATABASE_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;

if (env.ENABLE_DB_INITIALIZE) {
  console.warn("ENABLE_DB_INITIALIZE is true");
}
