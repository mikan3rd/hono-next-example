import { mock } from "bun:test";
import type { GoTrueClient } from "@supabase/supabase-js";

export const supabaseUid = "11111111-1111-1111-1111-111111111111";

// https://supabase.com/docs/reference/javascript/auth-getclaims
export const getClaims = mock(
  async (): ReturnType<GoTrueClient["getClaims"]> => {
    return {
      data: {
        claims: {
          aal: "aal1",
          amr: [
            {
              method: "email",
              timestamp: 1715766000,
            },
          ],
          app_metadata: {},
          aud: "authenticated",
          email: "example@email.com",
          exp: 1715769600,
          iat: 1715766000,
          is_anonymous: false,
          iss: "https://project-id.supabase.co/auth/v1",
          phone: "+13334445555",
          role: "authenticated",
          session_id: supabaseUid,
          sub: "11111111-1111-1111-1111-111111111111",
          user_metadata: {},
        },
        header: {
          alg: "RS256",
          typ: "JWT",
          kid: "11111111-1111-1111-1111-111111111111",
        },
        signature: new Uint8Array(),
      },
      error: null,
    };
  },
);

mock.module("@supabase/supabase-js", () => ({
  createClient: mock(() => ({
    auth: {
      getClaims,
    },
  })),
}));
