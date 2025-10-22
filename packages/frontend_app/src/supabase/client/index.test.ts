import { describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { createClient } from ".";

// TODO: createClientからアクセス許可しないようにする想定
describe("createClient", () => {
  const supabaseUid = faker.string.uuid();

  it("can fetch from supabase DB", async () => {
    const client = createClient();
    const res = await client.from("users").select();
    expect(res.status).toBe(200);
  });

  it("can insert into supabase DB", async () => {
    const client = createClient();
    const res = await client.from("users").insert({
      supabase_uid: supabaseUid,
      display_name: faker.person.fullName(),
    });
    expect(res.status).toBe(201);
  });

  it("can update supabase DB", async () => {
    const client = createClient();
    const res = await client.from("users").update({});
    expect(res.status).toBe(204);
  });

  it("can delete from supabase DB", async () => {
    const client = createClient();
    const res = await client
      .from("users")
      .delete()
      .eq("supabase_uid", supabaseUid);
    expect(res.status).toBe(204);
  });
});
