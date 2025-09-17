import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata, ResolvingMetadata } from "next";
import { getGetPostsQueryKey, getPosts } from "../../client";
import { PostIndex } from "../../components/pages/post/index";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const result = await getPosts();
  if (result.status !== 200) {
    throw new Error("Failed to get posts");
  }
  const metadata = await parent;
  return {
    title: `posts: ${result.data.posts.length} | ${metadata.title?.absolute}`,
  };
}

export default async function PostPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: getGetPostsQueryKey(),
    // FIXME: Only plain objects can be passed to Client Components from Server Components.
    queryFn: async () => {
      const { data, status } = await getPosts();
      return { data, status };
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostIndex />
    </HydrationBoundary>
  );
}
