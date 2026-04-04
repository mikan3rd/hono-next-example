"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { SESSION_STORAGE } from "../../../lib/sessionStorage/constants";
import {
  readSessionStorageEntryIsSet,
  writeSessionStorageItem,
} from "../../../lib/sessionStorage/safeSessionStorage";
import {
  FirstVisitSplashOverlay,
  SPLASH_FADE_OUT_MS,
} from "./FirstVisitSplashOverlay";

const SPLASH_MIN_DISPLAY_MS = 800;

type Props = {
  appTitle: string;
};

export function FirstVisitSplash({ appTitle }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [alreadySeen, setAlreadySeen] = useState(true);
  const [exiting, setExiting] = useState(false);

  useLayoutEffect(() => {
    setHydrated(true);
    setAlreadySeen(
      readSessionStorageEntryIsSet(SESSION_STORAGE.FIRST_VISIT_SPLASH),
    );
  }, []);

  useEffect(() => {
    if (!hydrated || alreadySeen) return;
    const t = window.setTimeout(() => setExiting(true), SPLASH_MIN_DISPLAY_MS);
    return () => window.clearTimeout(t);
  }, [hydrated, alreadySeen]);

  useEffect(() => {
    if (!exiting) return;
    const t = window.setTimeout(() => {
      writeSessionStorageItem(SESSION_STORAGE.FIRST_VISIT_SPLASH);
      setAlreadySeen(true);
    }, SPLASH_FADE_OUT_MS);
    return () => window.clearTimeout(t);
  }, [exiting]);

  if (!hydrated || alreadySeen) return null;

  return <FirstVisitSplashOverlay appTitle={appTitle} exiting={exiting} />;
}
