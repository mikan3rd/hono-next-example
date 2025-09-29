import { createBrowserClient } from "@supabase/ssr";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { env } from "../../env";

export function __triggerAuthStateChange(
  _event: AuthChangeEvent,
  _nextSession: Session | null,
): void {
  throw new Error(
    "__triggerAuthStateChange should not be called in production",
  );
}

export const mockSession = null;

// Mock debug utilities (no-op in production)
export const __debugListeners = {
  get count() {
    return 0;
  },
  get all() {
    return [];
  },
  clear() {},
};

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
