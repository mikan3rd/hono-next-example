export function createClient() {
  return {
    auth: {
      signInAnonymously: () => Promise.resolve({ error: null }),
    },
  };
}
