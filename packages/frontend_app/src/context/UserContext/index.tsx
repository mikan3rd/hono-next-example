"use client";

import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  setEnableAutoLogin: (enable: boolean) => void;
  getLoginUser: () => Promise<boolean>;
};

const UserContext = createContext<Context | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false);

  const { data, refetch: getUserLogin } = useGetUserLogin({
    query: { enabled: false },
  });
  const enableAutoLoginRef = useRef(true);

  const user = useMemo(() => {
    if (data === undefined) return undefined;
    if (data.status !== 200) return null;
    return data.data;
  }, [data]);

  const getLoginUser = useCallback(async () => {
    const response = await getUserLogin();
    if (response.data?.status !== 200) {
      const supabase = createClient();
      await supabase.auth.signOut();
      return false;
    }
    return true;
  }, [getUserLogin]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (nextSession !== null && enableAutoLoginRef.current) {
        await getLoginUser();
      }
      setSession(nextSession);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [getLoginUser]);

  const sessionState: SessionState = useMemo(() => {
    if (
      session !== undefined &&
      session !== null &&
      user !== undefined &&
      user !== null
    ) {
      return { status: "loggedIn", session, user };
    }

    if (session === null) {
      return { status: "loggedOut", session: null, user: null };
    }

    return { status: "loading", session: undefined, user: undefined };
  }, [session, user]);

  const checkLoggedIn = useCallback((): boolean => {
    if (sessionState.status !== "loggedIn") {
      setIsOpenLoginDialog(true);
      return false;
    }
    return true;
  }, [sessionState]);

  const setEnableAutoLogin = useCallback((enable: boolean) => {
    enableAutoLoginRef.current = enable;
  }, []);

  return (
    <UserContext.Provider
      value={{
        sessionState,
        isOpenLoginDialog,
        setIsOpenLoginDialog,
        checkLoggedIn,
        setEnableAutoLogin,
        getLoginUser,
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
