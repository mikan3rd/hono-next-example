"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "#src/supabase/client";

const supabase = createClient();

export const useSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { session };
};
