import { z } from "@hono/zod-openapi";

export const ERROR_BY_STATUS = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
} as const;

export type HttpErrorStatus = keyof typeof ERROR_BY_STATUS;
export type ErrorCode = (typeof ERROR_BY_STATUS)[HttpErrorStatus];

const errorSchemaFactory = (status: HttpErrorStatus) => {
  const code = ERROR_BY_STATUS[status];
  return z
    .object({
      code: z.literal(code).openapi({ example: code }),
      message: z.string().openapi({ description: "explanation" }),
    })
    .openapi(`ErrorResponse${status}`);
};

export type ErrorResponse = {
  code: ErrorCode;
  message: string;
};

export const ErrorResponses = {
  400: {
    description: ERROR_BY_STATUS[400],
    content: {
      "application/json": {
        schema: errorSchemaFactory(400),
      },
    },
  },
  401: {
    description: ERROR_BY_STATUS[401],
    content: {
      "application/json": {
        schema: errorSchemaFactory(401),
      },
    },
  },
  403: {
    description: ERROR_BY_STATUS[403],
    content: {
      "application/json": {
        schema: errorSchemaFactory(403),
      },
    },
  },
  404: {
    description: ERROR_BY_STATUS[404],
    content: {
      "application/json": {
        schema: errorSchemaFactory(404),
      },
    },
  },
  500: {
    description: ERROR_BY_STATUS[500],
    content: {
      "application/json": {
        schema: errorSchemaFactory(500),
      },
    },
  },
};
