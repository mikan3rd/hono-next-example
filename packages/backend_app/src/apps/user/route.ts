import { createRoute } from "@hono/zod-openapi";
import { ErrorResponses } from "../../dto/output/error";

export const signupRoute = createRoute({
  tags: ["user"],
  method: "post",
  path: "/signup",
  responses: {
    200: {
      description: "signup",
    },
    ...ErrorResponses,
  },
});
