export type StorybookLocale = "en" | "ja";

/** Storybook `globals.locale` とツールバー既定から表示用ロケールを決める */
export function resolveStorybookLocale(
  globals: Record<string, unknown>,
): StorybookLocale {
  return globals.locale === "ja" ? "ja" : "en";
}
