import { Suspense } from "react";
import Providers from "../app/providers";
import { LoadingMask } from "../components/ui/LoadingMask";
import { Toaster } from "../components/ui/Sonner";
import { UserContextProvider } from "../context/UserContext";

export const RootProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={<LoadingMask />}>
        <Providers>
          <UserContextProvider>{children}</UserContextProvider>
        </Providers>
      </Suspense>
      <Toaster duration={1000 * 10} />
    </>
  );
};
