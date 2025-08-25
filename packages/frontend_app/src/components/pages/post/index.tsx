"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { createPost, deletePost, getPosts, queryKey } from "./client";
import { EmptyState } from "./components/EmptyState";
import { PostCard } from "./components/PostCard";
import { PostForm } from "./components/PostForm";

export const Index = () => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn: getPosts,
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      handleClearForm();
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
    },
  });

  const handleCreatePost = (postContent: string) => {
    createPostMutation.mutate(postContent);
  };

  const handleDeletePost = (id: number) => {
    deletePostMutation.mutate(id);
  };

  const handleClearForm = () => {
    setContent("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Posts</h1>
            <p className="text-gray-600">View the latest posts</p>
          </div>

          <PostForm
            content={content}
            onContentChange={setContent}
            onSubmit={handleCreatePost}
            onClear={handleClearForm}
            isPending={createPostMutation.isPending}
          />
        </div>

        {data.posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
                isDeleting={deletePostMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
