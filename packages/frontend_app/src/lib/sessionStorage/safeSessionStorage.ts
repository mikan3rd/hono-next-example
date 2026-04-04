import type { SessionStorageEntry } from "./constants";

export type ReadSessionStorageItemResult =
  | { ok: true; value: string | null }
  | { ok: false };

export type MutateSessionStorageResult = { ok: true } | { ok: false };

export function readSessionStorageItem<T extends SessionStorageEntry>(
  entry: T,
): ReadSessionStorageItemResult {
  try {
    return { ok: true, value: sessionStorage.getItem(entry.KEY) };
  } catch {
    return { ok: false };
  }
}

export function writeSessionStorageItem<T extends SessionStorageEntry>(
  entry: T,
): MutateSessionStorageResult {
  try {
    sessionStorage.setItem(entry.KEY, entry.VALUE);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function removeSessionStorageItem<T extends SessionStorageEntry>(
  entry: T,
): MutateSessionStorageResult {
  try {
    sessionStorage.removeItem(entry.KEY);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function readSessionStorageEntryIsSet<T extends SessionStorageEntry>(
  entry: T,
): boolean {
  const result = readSessionStorageItem(entry);
  if (!result.ok) return true;
  return result.value === entry.VALUE;
}
