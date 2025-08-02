import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BACKEND_APP_SERVER_URL: z.url(),

    // For playwright
    CI: z.coerce.boolean().optional().default(false),
    FRONTEND_APP_PORT: z.coerce.number().min(1),
  },

  client: {
    NEXT_PUBLIC_BACKEND_APP_URL: z.url(),
  },

  runtimeEnv: {
    BACKEND_APP_SERVER_URL: process.env.BACKEND_APP_SERVER_URL,
    NEXT_PUBLIC_BACKEND_APP_URL: process.env.NEXT_PUBLIC_BACKEND_APP_URL,

    // For playwright
    CI: process.env.CI,
    FRONTEND_APP_PORT: process.env.FRONTEND_APP_PORT,
  },
});
