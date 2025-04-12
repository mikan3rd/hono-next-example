import { z } from "@hono/zod-openapi";

// biome-ignore lint/suspicious/noExplicitAny:
const errorSchemaFactory = (code: z.ZodEnum<any>) => {
  return z
    .object({
      code: code.openapi({
        description: "error code.",
        example: code._def.values.at(0),
      }),
      message: z.string().openapi({ description: "explanation" }),
    })
    .openapi("Error");
};

export const ErrorResponses = {
  400: {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: errorSchemaFactory(z.enum(["BAD_REQUEST"])),
      },
    },
  },
  404: {
    description: "Not Found",
    content: {
      "application/json": {
        schema: errorSchemaFactory(z.enum(["NOT_FOUND"])),
      },
    },
  },
  500: {
    description: "Internal Server Error",
    content: {
      "application/json": {
        schema: errorSchemaFactory(z.enum(["INTERNAL_SERVER_ERROR"])),
      },
    },
  },
};
