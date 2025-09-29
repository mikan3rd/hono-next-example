"use client";

import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "#src/supabase/client";

type Context = {
  session: Session | null | undefined;
  sessionStatus: "loading" | "loggedOut" | "loggedIn";
  isOpenLoginDialog: boolean;
  setIsOpenLoginDialog: (isOpen: boolean) => void;
  checkLoggedIn: () => boolean;
};

const UserContext = createContext<Context | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: Props) => {
  // TODO: DBのuserもここで取得するようにしたい
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => {
      subscription.unsubscribe();
    };
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

  const checkLoggedIn = useCallback((): boolean => {
    if (sessionStatus !== "loggedIn") {
      setIsOpenLoginDialog(true);
      return false;
    }
    return true;
  }, [sessionStatus]);

  return (
    <UserContext.Provider
      value={{
        session,
        sessionStatus,
        isOpenLoginDialog,
        setIsOpenLoginDialog,
        checkLoggedIn,
      }}
    >
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
