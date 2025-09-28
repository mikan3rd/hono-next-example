import type {
  GoTrueClient,
  Session,
  Subscription,
  User,
} from "@supabase/supabase-js";

const user: User = {
  id: "123",
} as User;

const session: Session = {} as Session;

const subscription: Subscription = {
  id: "123",
  callback: () => {},
  unsubscribe: () => {},
};

const signInAnonymously: GoTrueClient["signInAnonymously"] = () =>
  Promise.resolve({ error: null, data: { user, session } });

const onAuthStateChange: GoTrueClient["onAuthStateChange"] = () => ({
  data: { subscription },
});

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
