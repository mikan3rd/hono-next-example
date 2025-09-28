// TODO: 型定義をできるだけ正確にしたい
export function createClient() {
  return {
    auth: {
      signInAnonymously: () => Promise.resolve({ error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () =>
        Promise.resolve({ error: null, data: { user: { id: "123" } } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  };
}
