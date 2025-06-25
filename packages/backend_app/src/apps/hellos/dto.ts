import { z } from "zod";

export const postHelloRequestSchema = z.object({
  name: z.string().min(1),
});
