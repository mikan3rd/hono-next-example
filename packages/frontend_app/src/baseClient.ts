import type { AppType } from "backend_app/src/apps";
import { hc } from "hono/client";
import { env } from "./env";

/**
 * FIXME:
 * When using docker compose, the URLs are different
 * because the server-side request executed in the container
 * and the client-side execution executed from the browser must be considered.
 */
const baseUrl =
  typeof window === "undefined"
    ? env.BACKEND_APP_SERVER_URL
    : env.NEXT_PUBLIC_BACKEND_APP_URL;

export const baseClient = hc<AppType>(baseUrl);
