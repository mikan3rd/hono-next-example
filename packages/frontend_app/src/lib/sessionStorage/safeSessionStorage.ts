import type { SESSION_STORAGE } from "./constants";

export type ReadSessionStorageItemResult =
  | { ok: true; value: string | null }
  | { ok: false };

export type MutateSessionStorageResult = { ok: true } | { ok: false };

type SessionStorageMap = typeof SESSION_STORAGE;
type Entry = SessionStorageMap[keyof SessionStorageMap];

export function readSessionStorageItem<const T extends Entry>(
  entry: T,
): ReadSessionStorageItemResult {
  try {
    return { ok: true, value: sessionStorage.getItem(entry.KEY) };
  } catch {
    return { ok: false };
  }
}

export function writeSessionStorageItem<const T extends Entry>(
  entry: T,
): MutateSessionStorageResult {
  try {
    sessionStorage.setItem(entry.KEY, entry.VALUE);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function removeSessionStorageItem<const T extends Entry>(
  entry: T,
): MutateSessionStorageResult {
  try {
    sessionStorage.removeItem(entry.KEY);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function readSessionStorageEntryIsSet<const T extends Entry>(
  entry: T,
): boolean {
  const result = readSessionStorageItem(entry);
  if (!result.ok) return true;
  return result.value === entry.VALUE;
}
