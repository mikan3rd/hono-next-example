"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getGetPostsQueryKey, useGetPostsSuspense } from "../../../client";
import { EmptyState } from "./components/EmptyState";
import { PostCard } from "./components/PostCard";
import { PostForm } from "./components/PostForm";

export const Index = () => {
  const queryClient = useQueryClient();

  const {
    data: {
      data: { posts },
    },
  } = useGetPostsSuspense();

  const invalidatePostsQuery = () => {
    queryClient.invalidateQueries({ queryKey: getGetPostsQueryKey() });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Posts</h1>
            <p className="text-gray-600">View the latest posts</p>
          </div>

          <PostForm invalidatePostsQuery={invalidatePostsQuery} />
        </div>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                invalidatePostsQuery={invalidatePostsQuery}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
