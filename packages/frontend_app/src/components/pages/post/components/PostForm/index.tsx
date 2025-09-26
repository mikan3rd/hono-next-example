"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getGetPostsQueryKey, usePostPosts } from "../../../../../client";
import { Button } from "../../../../ui/Button";

export const PostForm = () => {
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");

  const createPostMutation = usePostPosts();

  const handleClearForm = () => {
    setContent("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) return;
    createPostMutation.mutate(
      { data: { content: trimmedContent } },
      {
        onSuccess: () => {
          toast.success("Post created successfully");
          queryClient.invalidateQueries({ queryKey: getGetPostsQueryKey() });
          handleClearForm();
        },
        onError: (error) => {
          toast.error(`Failed to create post: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Create New Post
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
            rows={4}
            disabled={createPostMutation.isPending}
          />
        </div>
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={!content.trim() || createPostMutation.isPending}
          >
            {createPostMutation.isPending ? "Creating..." : "Create Post"}
          </Button>
          <Button type="button" onClick={handleClearForm} variant="secondary">
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
};
