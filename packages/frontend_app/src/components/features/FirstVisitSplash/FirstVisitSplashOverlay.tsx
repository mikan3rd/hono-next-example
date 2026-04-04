"use client";

import { Loader2Icon } from "lucide-react";
import { cn } from "../../../lib/utils";

export const SPLASH_FADE_OUT_MS = 300;

export function FirstVisitSplashOverlay({
  appTitle,
  exiting,
}: {
  appTitle: string;
  exiting: boolean;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background transition-opacity ease-out",
        exiting ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: `${SPLASH_FADE_OUT_MS}ms` }}
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
