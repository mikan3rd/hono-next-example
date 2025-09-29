import type {
  AuthChangeEvent,
  GoTrueClient,
  Session,
  Subscription,
  User,
} from "@supabase/supabase-js";

// TODO: 型定義をできるだけ正確にしたい
const user: User = {
  id: "123",
} as User;

// TODO: 型定義をできるだけ正確にしたい
const session: Session = { user } as Session;

const signInAnonymously: GoTrueClient["signInAnonymously"] = () =>
  Promise.resolve({ error: null, data: { user, session } });

const signOut: GoTrueClient["signOut"] = () => Promise.resolve({ error: null });

const getUser: GoTrueClient["getUser"] = () =>
  Promise.resolve({ error: null, data: { user } });

type AuthListener = (
  event: AuthChangeEvent,
  nextSession: Session | null,
) => void;

const listeners = new Set<AuthListener>();

const onAuthStateChange: GoTrueClient["onAuthStateChange"] = (callback) => {
  const listener: AuthListener = (event, nextSession) => {
    console.info("listener", event, nextSession);
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
  for (const listener of listeners) {
    console.info("triggerAuthStateChange", event, nextSession);
    listener(event, nextSession);
  }
};

export function createClient() {
  return {
    auth: {
      signInAnonymously,
      signOut,
      getUser,
      onAuthStateChange,
    },
  };
}

export { session as mockSession };
