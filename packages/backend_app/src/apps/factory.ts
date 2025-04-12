import { OpenAPIHono, z } from "@hono/zod-openapi";
import { createSchemaFactory } from "drizzle-zod";
import { HTTPException } from "hono/http-exception";
import type { ErrorResponse } from "../dto/output/error";

export const createApp = () => {
  const app = new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
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

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json<ErrorResponse>(
        {
          message: err.message,
        },
        {
          status: err.status,
        },
      );
    }
    return c.json<ErrorResponse>(
      {
        message: "Internal Server Error",
      },
      500,
    );
  });

  return app;
};

export const { createSelectSchema, createInsertSchema, createUpdateSchema } =
  createSchemaFactory({
    zodInstance: z,
  });
