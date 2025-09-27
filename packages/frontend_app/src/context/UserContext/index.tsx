"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "#src/supabase/client";

type Context = {
  session: Session | null | undefined;
  sessionStatus: "loading" | "loggedOut" | "loggedIn";
};

const UserContext = createContext<Context | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: Props) => {
  // TODO: DBのuserもここで取得するようにしたい
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  const sessionStatus = useMemo(() => {
    if (session === undefined) {
      return "loading";
    }
    if (session === null) {
      return "loggedOut";
    }
    return "loggedIn";
  }, [session]);

  return (
    <UserContext.Provider value={{ session, sessionStatus }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
