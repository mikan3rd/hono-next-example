import { OpenAPIHono, z } from "@hono/zod-openapi";
import { createSchemaFactory } from "drizzle-zod";
import { HTTPException } from "hono/http-exception";
import type { ErrorCode, ErrorResponse } from "../dto/output/error";

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
      const code: ErrorCode = (() => {
        switch (err.status) {
          case 400:
            return "Bad Request";
          case 404:
            return "Not Found";
          default:
            return "Internal Server Error";
        }
      })();
      return c.json<ErrorResponse>(
        {
          code,
          message: err.message,
        },
        {
          status: err.status,
        },
      );
    }
    return c.json<ErrorResponse>(
      {
        code: "Internal Server Error",
        message: err.message,
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
