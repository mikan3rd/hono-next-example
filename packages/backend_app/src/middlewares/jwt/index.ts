import { createMiddleware } from "hono/factory";
import type { ErrorResponse } from "../../dto/output/error";

export const jwtMiddleware = createMiddleware(async (c, next) => {
  const credentials = c.req.header("Authorization");
  if (!credentials) {
    return c.json<ErrorResponse>(
      { code: "Unauthorized", message: "Missing authorization header" },
      401,
    );
  }

  const [_, token] = credentials.split(/\s+/);
  if (!token) {
    return c.json<ErrorResponse>(
      { code: "Unauthorized", message: "Missing token" },
      401,
    );
  }

  // TODO: Verify JWT

  await next();
});
