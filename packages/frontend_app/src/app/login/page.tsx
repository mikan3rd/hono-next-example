import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SignUpDialog } from "../../components/features/SignUpDialog";

export default async function LoginPage() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SignUpDialog />
    </HydrationBoundary>
  );
}
