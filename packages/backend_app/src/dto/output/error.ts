import { z } from "@hono/zod-openapi";

const ErrorSchema = z
  .object({
    code: z.number().openapi({
      example: 400,
    }),
    message: z.string().openapi({
      example: "Bad Request",
    }),
  })
  .openapi("Error");

export const ErrorResponses = {
  400: {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: ErrorSchema,
      },
    },
  },
  500: {
    description: "Internal Server Error",
    content: {
      "application/json": { schema: ErrorSchema },
    },
  },
};
