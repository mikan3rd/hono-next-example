import { OpenAPIHono } from "@hono/zod-openapi";

export const createApp = () => {
  return new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        console.warn(result);
        return c.json(
          {
            code: 400,
            message: "Validation Error",
          },
          400,
        );
      }
    },
  });
};
