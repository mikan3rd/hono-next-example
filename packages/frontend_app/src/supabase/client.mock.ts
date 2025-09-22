export function createClient() {
  return {
    auth: {
      signInAnonymously: () => Promise.resolve({ error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: { id: "123" } } }),
    },
  };
}
