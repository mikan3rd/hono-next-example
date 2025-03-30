import { createRoute, z } from "@hono/zod-openapi";
import { messageSchema } from "../../dto/output/hello";
import { postHelloRequestSchema } from "./dto";

export const getHelloRoute = createRoute({
  tags: ["sample"],
  method: "get",
  path: "/",
  request: {
    query: z.object({
      name: z
        .string()
        .min(1)
        .openapi({
          param: {
            description: "Name",
          },
        }),
    }),
  },
  responses: {
    200: {
      description: "Hello message",
      content: {
        "application/json": {
          schema: messageSchema,
        },
      },
    },
    // TODO: schema を設定しないと型定義が不完全
    // 400: {
    //   description: "Bad Request",
    // },
  },
});

export const postHelloRoute = createRoute({
  tags: ["sample"],
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: postHelloRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Hello message with name",
      content: {
        "application/json": {
          schema: messageSchema,
        },
      },
    },
    // TODO: schema を設定しないと型定義が不完全
    // 400: {
    //   description: "Bad Request",
    // },
  },
});
