import { userPublicFields } from "../../db/field";
import { usersTable } from "../../db/schema";
import { createSelectSchema } from "../factory";

export const userSelectSchema = createSelectSchema(usersTable)
  .pick(userPublicFields)
  .openapi("user");
