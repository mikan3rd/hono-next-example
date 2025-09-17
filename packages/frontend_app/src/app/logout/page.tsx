import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { LogoutDialog } from "../../components/features/LogoutDialog";

export const dynamic = "force-dynamic";

export default async function LogoutPage() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LogoutDialog />
    </HydrationBoundary>
  );
}
