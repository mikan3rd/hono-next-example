import {
  __debugListeners,
  getUser,
  mockSession,
  onAuthStateChange,
  signInAnonymously,
  signOut,
  triggerAuthStateChange,
} from "./mockFunc";

// Export mock functions for story testing
export {
  triggerAuthStateChange as __triggerAuthStateChange,
  mockSession,
  __debugListeners,
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
