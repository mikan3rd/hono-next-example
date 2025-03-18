import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata, ResolvingMetadata } from "next";
import { getHello } from "../../components/pages/hello/client";
import { Index } from "../../components/pages/hello/index";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { message } = await getHello();
  const metadata = await parent;
  return {
    title: `message: ${message} | ${metadata.title?.absolute}`,
  };
}

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
