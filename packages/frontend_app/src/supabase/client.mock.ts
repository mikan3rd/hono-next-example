import type {
  AuthChangeEvent,
  GoTrueClient,
  Session,
  Subscription,
  User,
} from "@supabase/supabase-js";

export const user: User = {
  id: "123",
} as User;

export const session: Session = { user } as Session;

const signInAnonymously: GoTrueClient["signInAnonymously"] = () =>
  Promise.resolve({ error: null, data: { user, session } });

type AuthListener = (
  event: AuthChangeEvent,
  nextSession: Session | null,
) => void;

const listeners = new Set<AuthListener>();

const onAuthStateChange: GoTrueClient["onAuthStateChange"] = (callback) => {
  const listener: AuthListener = (event, nextSession) =>
    callback(event, nextSession);
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

export function __triggerAuthStateChange(
  event: AuthChangeEvent,
  nextSession: Session | null,
) {
  for (const listener of listeners) {
    listener(event, nextSession);
  }
}

// TODO: 型定義をできるだけ正確にしたい
export function createClient() {
  return {
    auth: {
      signInAnonymously,
      signOut: () => Promise.resolve({ error: null }),
      getUser: () =>
        Promise.resolve({ error: null, data: { user: { id: "123" } } }),
      onAuthStateChange,
    },
  };
}
