"use client";

import { Loader2Icon } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  SPLASH_SESSION_STORAGE_KEY,
  SPLASH_STORAGE_VALUE,
} from "../../../lib/sessionStorage/constants";
import { cn } from "../../../lib/utils";

const SPLASH_MIN_DISPLAY_MS = 800;
const SPLASH_FADE_OUT_MS = 300;

type Props = {
  appTitle: string;
};

export function FirstVisitSplash({ appTitle }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [alreadySeen, setAlreadySeen] = useState(true);
  const [exiting, setExiting] = useState(false);

  useLayoutEffect(() => {
    setHydrated(true);
    try {
      setAlreadySeen(
        sessionStorage.getItem(SPLASH_SESSION_STORAGE_KEY) ===
          SPLASH_STORAGE_VALUE,
      );
    } catch {
      setAlreadySeen(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || alreadySeen) return;
    const t = window.setTimeout(() => setExiting(true), SPLASH_MIN_DISPLAY_MS);
    return () => window.clearTimeout(t);
  }, [hydrated, alreadySeen]);

  useEffect(() => {
    if (!exiting) return;
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(
          SPLASH_SESSION_STORAGE_KEY,
          SPLASH_STORAGE_VALUE,
        );
      } catch {}
      setAlreadySeen(true);
    }, SPLASH_FADE_OUT_MS);
    return () => window.clearTimeout(t);
  }, [exiting]);

  if (!hydrated || alreadySeen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background transition-opacity duration-300 ease-out",
        exiting ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      data-testid="splash-screen"
      aria-hidden={exiting}
    >
      <p className="font-sans text-2xl font-semibold tracking-tight text-foreground">
        {appTitle}
      </p>
      <Loader2Icon className="size-8 animate-spin text-primary" aria-hidden />
    </div>
  );
}
