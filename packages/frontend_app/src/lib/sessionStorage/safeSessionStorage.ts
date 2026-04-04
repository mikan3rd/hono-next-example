export type ReadSessionStorageItemResult =
  | { ok: true; value: string | null }
  | { ok: false };

export type MutateSessionStorageResult = { ok: true } | { ok: false };

export function readSessionStorageItem(
  key: string,
): ReadSessionStorageItemResult {
  try {
    return { ok: true, value: sessionStorage.getItem(key) };
  } catch {
    return { ok: false };
  }
}

export function writeSessionStorageItem(
  key: string,
  value: string,
): MutateSessionStorageResult {
  try {
    sessionStorage.setItem(key, value);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function removeSessionStorageItem(
  key: string,
): MutateSessionStorageResult {
  try {
    sessionStorage.removeItem(key);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
