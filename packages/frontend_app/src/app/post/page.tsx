import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata, ResolvingMetadata } from "next";
import { getPosts } from "../../components/pages/post/client";
import { Index } from "../../components/pages/post/index";
import { QueryKey } from "../../queryKey";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const result = await getPosts();
  const metadata = await parent;
  return {
    title: `posts: ${result.posts.length} | ${metadata.title?.absolute}`,
  };
}

export default async function Hello() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: QueryKey.posts.all,
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Index />
    </HydrationBoundary>
  );
}
