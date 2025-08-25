"use client";

import { formatDate } from "../utils/dateUtils";

type Post = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
};

type PostCardProps = {
  post: Post;
  onDelete: (id: number) => void;
  isDeleting: boolean;
};

export const PostCard = ({ post, onDelete, isDeleting }: PostCardProps) => {
  const isUpdated = post.updated_at !== post.created_at;

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
            <button
              type="button"
              onClick={() => onDelete(post.id)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 disabled:text-red-300 border border-red-300 hover:border-red-500 disabled:border-red-200 transition-colors duration-200 px-2 py-1 text-xs font-medium rounded"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-900 text-sm leading-relaxed line-clamp-4 whitespace-pre-wrap">
            {post.content}
          </p>
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
