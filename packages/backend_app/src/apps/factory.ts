import { OpenAPIHono, z } from "@hono/zod-openapi";
import { createSchemaFactory } from "drizzle-zod";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ErrorCode, ErrorResponse } from "../dto/output/error";
import type { HonoEnv } from "./context";

const onError: Parameters<Hono<HonoEnv>["onError"]>[0] = (err, c) => {
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
  console.error("Unhandled error", err);
  return c.json<ErrorResponse>(
    {
      code: "Internal Server Error",
      message: err.message,
    },
    500,
  );
};

export const createApp = () => {
  const app = new OpenAPIHono<HonoEnv>({
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

  app.onError(onError);

  return app;
};

export const createHonoApp = () => {
  const app = new Hono<HonoEnv>();

  app.onError(onError);

  return app;
};

export const { createSelectSchema, createInsertSchema, createUpdateSchema } =
  createSchemaFactory({
    zodInstance: z,
  });
