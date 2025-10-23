import { describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { createClient } from ".";

describe("createClient", () => {
  const supabaseUid = faker.string.uuid();

  // https://supabase.com/docs/guides/troubleshooting/database-api-42501-errors
  it("can not fetch from supabase DB", async () => {
    const client = createClient();
    const { error } = await client.from("users").select();
    expect(error?.code).toBe("42501");
  });

  it("can not insert into supabase DB", async () => {
    const client = createClient();
    const { error } = await client.from("users").insert({
      supabase_uid: supabaseUid,
      display_name: faker.person.fullName(),
    });
    expect(error?.code).toBe("42501");
  });

  it("can not update supabase DB", async () => {
    const client = createClient();
    const { error } = await client.from("users").update({});
    expect(error?.code).toBe("42501");
  });

  it("can not delete from supabase DB", async () => {
    const client = createClient();
    const { error } = await client
      .from("users")
      .delete()
      .eq("supabase_uid", supabaseUid);
    expect(error?.code).toBe("42501");
  });
});
