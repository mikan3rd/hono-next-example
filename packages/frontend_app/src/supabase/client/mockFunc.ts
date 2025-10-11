import type {
  AuthChangeEvent,
  GoTrueClient,
  Session,
  Subscription,
  User,
} from "@supabase/supabase-js";
import { waitFor } from "storybook/test";

// TODO: 型定義をできるだけ正確にしたい
const user: User = {
  id: "123",
} as User;

// TODO: 型定義をできるだけ正確にしたい
const session: Session = { user } as Session;

export const signInAnonymously: GoTrueClient["signInAnonymously"] = () =>
  Promise.resolve({ error: null, data: { user, session } });

export const signOut: GoTrueClient["signOut"] = () =>
  Promise.resolve({ error: null });

export const getUser: GoTrueClient["getUser"] = () =>
  Promise.resolve({ error: null, data: { user } });

type AuthListener = (
  event: AuthChangeEvent,
  nextSession: Session | null,
) => void;

const listeners = new Set<AuthListener>();

// デバッグ用: リスナー登録の追跡
export const __debugListeners = {
  get count() {
    return listeners.size;
  },
  get all() {
    return Array.from(listeners);
  },
  clear() {
    listeners.clear();
  },
};

export const onAuthStateChange: GoTrueClient["onAuthStateChange"] = (
  callback,
) => {
  const listener: AuthListener = (event, nextSession) => {
    // console.info("listener", event, nextSession);
    callback(event, nextSession);
  };
  listeners.add(listener);

  const sub: Subscription = {
    id: "mock-subscription",
    callback: listener,
    unsubscribe: () => {
      listeners.delete(listener);
    },
  };

  return { data: { subscription: sub } };
};

export const triggerAuthStateChange = (
  event: AuthChangeEvent,
  nextSession: Session | null,
) => {
  // console.info("triggerAuthStateChange called", event, nextSession);
  // console.info("Active listeners count:", listeners.size);
  for (const listener of listeners) {
    // console.info("Calling listener", event, nextSession);
    listener(event, nextSession);
  }
};

export const waitForAuthStateChange = async () => {
  await waitFor(
    async () => {
      const listenerCount = __debugListeners.count;
      if (listenerCount === 0) {
        throw new Error("No listeners registered yet");
      }
    },
    { timeout: 5000 },
  );
};

export { session as mockSession };
