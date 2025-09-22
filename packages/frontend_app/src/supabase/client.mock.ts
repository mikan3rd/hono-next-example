export function createClient() {
  return {
    auth: {
      signInAnonymously: () => Promise.resolve({ error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () =>
        Promise.resolve({ data: { error: null, user: { id: "123" } } }),
    },
  };
}
