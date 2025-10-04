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
import { useGetUserLogin } from "../../client";
import type { User } from "../../client/index.schemas";

type SessionState =
  | { status: "loading"; session: undefined; user: undefined }
  | { status: "loggedOut"; session: null; user: null }
  | { status: "loggedIn"; session: Session; user: User };

type Context = {
  sessionState: SessionState;
  isOpenLoginDialog: boolean;
  setIsOpenLoginDialog: (isOpen: boolean) => void;
  checkLoggedIn: () => boolean;
};

const UserContext = createContext<Context | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false);

  const { data, refetch } = useGetUserLogin({ query: { enabled: false } });

  const user = useMemo(() => {
    if (data === undefined) return undefined;
    if (data.status !== 200) return null;
    return data.data;
  }, [data]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (nextSession !== null) {
        await refetch();
      }
      setSession(nextSession);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  const sessionState: SessionState = useMemo(() => {
    if (session === undefined || user === undefined) {
      return { status: "loading", session: undefined, user: undefined };
    }
    if (session === null || user === null) {
      return { status: "loggedOut", session: null, user: null };
    }
    return { status: "loggedIn", session, user };
  }, [session, user]);

  const checkLoggedIn = useCallback((): boolean => {
    if (sessionState.status !== "loggedIn") {
      setIsOpenLoginDialog(true);
      return false;
    }
    return true;
  }, [sessionState]);

  return (
    <UserContext.Provider
      value={{
        sessionState,
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
