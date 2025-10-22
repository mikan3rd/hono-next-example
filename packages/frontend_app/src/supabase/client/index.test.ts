import { describe, expect, it } from "bun:test";
import { createClient } from ".";

describe("createClient", () => {
  it("can access to supabase DB", async () => {
    const client = createClient();
    const res = await client.from("users").select();
    expect(res.status).toBe(200);
  });
});
