import { createRoute } from "@hono/zod-openapi";
import { ErrorResponses } from "../../dto/output/error";
import { signupRequestSchema } from "./dto";

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
