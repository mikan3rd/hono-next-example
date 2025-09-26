import { z } from "@hono/zod-openapi";

const errorCodes = [
  "Bad Request",
  "Unauthorized",
  "Forbidden",
  "Not Found",
  "Internal Server Error",
] as const;

export type ErrorCode = (typeof errorCodes)[number];

const errorSchemaFactory = (code: ErrorCode) => {
  return z
    .object({
      code: z.enum(errorCodes).openapi({
        example: code,
      }),
      message: z.string().openapi({ description: "explanation" }),
    })
    .openapi("ErrorResponse");
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

  401: {
    description: "Unauthorized",
    content: {
      "application/json": {
        schema: errorSchemaFactory("Unauthorized"),
      },
    },
  },

  403: {
    description: "Forbidden",
    content: {
      "application/json": {
        schema: errorSchemaFactory("Forbidden"),
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
