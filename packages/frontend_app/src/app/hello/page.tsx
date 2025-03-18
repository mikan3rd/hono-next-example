import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getHello } from "../../components/pages/hello/client";
import { Index } from "../../components/pages/hello/index";

export default async function Hello() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["hello"],
    queryFn: getHello,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Index />
    </HydrationBoundary>
  );
}
