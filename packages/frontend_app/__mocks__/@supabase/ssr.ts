export function createBrowserClient() {
  return {
    auth: {
      signInAnonymously: () => Promise.resolve({ error: null }),
    },
  };
}
