import { z } from "@hono/zod-openapi";

const ErrorSchema = z
  .object({
    message: z.string().openapi({ description: "explanation" }),
  })
  .openapi("Error");

export type ErrorResponse = z.infer<typeof ErrorSchema>;

export const ErrorResponses = {
  400: {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: ErrorSchema,
      },
    },
  },
  404: {
    description: "Not Found",
    content: {
      "application/json": {
        schema: ErrorSchema,
      },
    },
  },
  500: {
    description: "Internal Server Error",
    content: {
      "application/json": {
        schema: ErrorSchema,
      },
    },
  },
};
