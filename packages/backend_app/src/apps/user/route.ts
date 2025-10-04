import { createRoute } from "@hono/zod-openapi";
import { ErrorResponses } from "../../dto/output/error";
import { signupRequestSchema, userSelectSchema } from "./dto";

export const signupRoute = createRoute({
  tags: ["user"],
  method: "post",
  path: "/signup",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: signupRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "signup",
    },
    ...ErrorResponses,
  },
});

export const getLoginUserRoute = createRoute({
  tags: ["user"],
  method: "get",
  path: "/login",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "get login user",
      content: {
        "application/json": {
          schema: userSelectSchema,
        },
      },
    },
    ...ErrorResponses,
  },
});
