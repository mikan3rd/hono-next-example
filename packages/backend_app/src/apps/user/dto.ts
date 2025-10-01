import { userPublicFields } from "../../db/field";
import { usersTable } from "../../db/schema";
import { createInsertSchema, createSelectSchema } from "../factory";

export const userSelectSchema = createSelectSchema(usersTable)
  .pick(userPublicFields)
  .strict()
  .openapi("user");

export const signupRequestSchema = createInsertSchema(usersTable, {
  display_name: (schema) =>
    schema.min(1).openapi({
      description: "The display name of the user",
      example: "John Doe",
    }),
}).pick({
  display_name: true,
});
