import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  runtimeEnv: process.env,

  server: {
    BACKEND_APP_PORT: z.coerce.number().min(1),
  },
});
