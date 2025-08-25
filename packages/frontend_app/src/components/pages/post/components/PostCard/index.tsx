"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { formatDate } from "../../../../../utils/dateUtils";
import { deletePost, updatePost } from "./client";

type Post = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
};

type PostCardProps = {
  post: Post;
  invalidatePostsQuery: () => void;
};

export const PostCard = ({ post, invalidatePostsQuery }: PostCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const isUpdated = post.updated_at !== post.created_at;

  const updatePostMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      invalidatePostsQuery();
    },
    onError: (error) => {
      console.error("Failed to update post:", error);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setIsEditing(false);
      invalidatePostsQuery();
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(post.content);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(post.content);
  };

  const handleSave = () => {
    const trimmedContent = editContent.trim();
    if (!trimmedContent) return;
    updatePostMutation.mutate({
      id: post.id.toString(),
      content: trimmedContent,
    });
  };

  const handleDelete = () => {
    deletePostMutation.mutate(post.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ID: {post.id}
          </span>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400">
              {isUpdated ? "Updated" : "New"}
            </div>
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={updatePostMutation.isPending || !editContent.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-2 py-1 text-xs font-medium rounded transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {updatePostMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={updatePostMutation.isPending}
                  className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 px-2 py-1 text-xs font-medium rounded transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleEdit}
                  disabled={updatePostMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-2 py-1 text-xs font-medium rounded transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deletePostMutation.isPending}
                  className="text-red-500 hover:text-red-700 disabled:text-red-300 border border-red-300 hover:border-red-500 disabled:border-red-200 transition-colors duration-200 px-2 py-1 text-xs font-medium rounded"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 text-sm"
              rows={4}
              disabled={updatePostMutation.isPending}
            />
          ) : (
            <p className="text-gray-900 text-sm leading-relaxed line-clamp-4 whitespace-pre-wrap">
              {post.content}
            </p>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Created: {formatDate(post.created_at)}</span>
            {isUpdated && <span>Updated: {formatDate(post.updated_at)}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
