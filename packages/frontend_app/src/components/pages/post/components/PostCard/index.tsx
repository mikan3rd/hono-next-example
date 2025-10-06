"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  getGetPostsQueryKey,
  useDeletePostsPublicId,
  usePutPostsPublicId,
} from "../../../../../client";
import { formatDate } from "../../../../../lib/dateUtils";
import { Badge } from "../../../../ui/Badge";
import { Button } from "../../../../ui/Button";

type Post = {
  public_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    public_id: string;
    display_name: string;
  };
};

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const isUpdated = post.updated_at !== post.created_at;

  const updatePostMutation = usePutPostsPublicId();
  const deletePostMutation = useDeletePostsPublicId();

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(post.content);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(post.content);
  };

  const handleSave = async () => {
    const trimmedContent = editContent.trim();
    if (!trimmedContent) return;
    const result = await updatePostMutation.mutateAsync({
      publicId: post.public_id,
      data: { content: trimmedContent },
    });

    if (result.status !== 200) {
      toast.error(`Failed to update post: ${result.data.message}`);
      return;
    }
    toast.success("Post updated successfully");
    setIsEditing(false);
    queryClient.invalidateQueries({ queryKey: getGetPostsQueryKey() });
  };

  const handleDelete = async () => {
    const result = await deletePostMutation.mutateAsync({
      publicId: post.public_id,
    });
    if (result.status !== 200) {
      toast.error(`Failed to delete post: ${result.data.message}`);
      return;
    }
    toast.success("Post deleted successfully");
    queryClient.invalidateQueries({ queryKey: getGetPostsQueryKey() });
  };

  return (
    <div
      data-testid="PostCard"
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-6">
        <div
          data-testid="PostCard-header"
          className="flex flex-wrap items-start justify-between gap-2 mb-4 min-w-0"
        >
          <div className="min-w-0 max-w-[65%] sm:max-w-[60%] md:max-w-full">
            <div
              data-testid="PostCard-displayName"
              className="text-sm font-medium text-gray-900 truncate"
              title={post.user.display_name}
            >
              {post.user.display_name}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isUpdated && <Badge variant="secondary">Updated</Badge>}
            {isEditing ? (
              <>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={updatePostMutation.isPending || !editContent.trim()}
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                >
                  {updatePostMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  disabled={updatePostMutation.isPending}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={handleEdit}
                  disabled={updatePostMutation.isPending}
                  variant="secondary"
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={deletePostMutation.isPending}
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <div data-testid="PostCard-content" className="mb-4">
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

        <div
          data-testid={`PostCard-date`}
          className="border-t border-gray-100 pt-4"
        >
          <div className="flex justify-between text-xs text-gray-500">
            <span suppressHydrationWarning>
              Created: {formatDate(post.created_at)}
            </span>
            {isUpdated && (
              <span suppressHydrationWarning>
                Updated: {formatDate(post.updated_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
