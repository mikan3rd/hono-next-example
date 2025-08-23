import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CI: z.coerce.boolean().optional().default(false),
    BACKEND_APP_SERVER_URL: z.url(),
    FRONTEND_APP_SERVER_URL: z.url(),
    FRONTEND_APP_PORT: z.coerce.number().min(1),
  },

  runtimeEnv: {
    CI: process.env.CI,
    BACKEND_APP_SERVER_URL: process.env.BACKEND_APP_SERVER_URL,
    FRONTEND_APP_SERVER_URL: process.env.FRONTEND_APP_SERVER_URL,
    FRONTEND_APP_PORT: process.env.FRONTEND_APP_PORT,
  },
});
