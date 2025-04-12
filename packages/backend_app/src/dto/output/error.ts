import { z } from "@hono/zod-openapi";

const errorCode = [
  "Bad Request",
  "Not Found",
  "Internal Server Error",
] as const;

export type ErrorCode = (typeof errorCode)[number];

const errorSchemaFactory = (code: ErrorCode) => {
  return z
    .object({
      code: z.enum(errorCode).openapi({
        example: code,
      }),
      message: z.string().openapi({ description: "explanation" }),
    })
    .openapi("Error");
};

export type ErrorResponse = z.infer<ReturnType<typeof errorSchemaFactory>>;

export const ErrorResponses = {
  400: {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: errorSchemaFactory("Bad Request"),
      },
    },
  },
  404: {
    description: "Not Found",
    content: {
      "application/json": {
        schema: errorSchemaFactory("Not Found"),
      },
    },
  },
  500: {
    description: "Internal Server Error",
    content: {
      "application/json": {
        schema: errorSchemaFactory("Internal Server Error"),
      },
    },
  },
};
