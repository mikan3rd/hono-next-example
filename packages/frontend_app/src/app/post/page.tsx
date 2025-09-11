import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata, ResolvingMetadata } from "next";
import { getGetPostsQueryKey, getPosts } from "../../client";
import { Index } from "../../components/pages/post/index";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const result = await getPosts();
  const metadata = await parent;
  return {
    title: `posts: ${result.data.posts.length} | ${metadata.title?.absolute}`,
  };
}

export default async function Hello() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: getGetPostsQueryKey(),
    queryFn: async () => ({ data: (await getPosts()).data }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Index />
    </HydrationBoundary>
  );
}
