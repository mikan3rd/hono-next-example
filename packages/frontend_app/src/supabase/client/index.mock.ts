import {
  getUser,
  onAuthStateChange,
  signInAnonymously,
  signOut,
} from "./mockFunc";

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
