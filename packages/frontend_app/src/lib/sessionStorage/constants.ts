export type SessionStorageEntry = {
  readonly KEY: string;
  readonly VALUE: string;
};

export const SESSION_STORAGE = {
  FIRST_VISIT_SPLASH: {
    KEY: "splash_shown_tab_v1",
    VALUE: "1",
  },
} as const satisfies Record<string, SessionStorageEntry>;
