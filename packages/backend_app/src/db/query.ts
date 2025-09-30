import type { db } from ".";
import { postPublicFields, userPublicFields } from "./field";

export const postWithUserQuery = {
  columns: postPublicFields,
  with: {
    user: {
      columns: userPublicFields,
    },
  },
} satisfies Parameters<typeof db.query.postsTable.findMany>[0];
