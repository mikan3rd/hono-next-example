import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata, ResolvingMetadata } from "next";
import { getHello } from "../../components/pages/post/client";
import { Index } from "../../components/pages/post/index";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  _props: unknown,
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
