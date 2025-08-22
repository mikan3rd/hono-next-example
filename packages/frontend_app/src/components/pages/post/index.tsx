"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getPosts, queryKey } from "./client";

export const Index = () => {
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn: getPosts,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Posts</h1>
          <p className="text-gray-600">View the latest posts</p>
        </div>

        {data.posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">No posts yet</p>
            <p className="text-gray-400">Create your first post</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      ID: {post.id}
                    </span>
                    <div className="text-xs text-gray-400">
                      {post.updated_at !== post.created_at ? "Updated" : "New"}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-900 text-sm leading-relaxed line-clamp-4">
                      {post.content}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Created: {formatDate(post.created_at)}</span>
                      {post.updated_at !== post.created_at && (
                        <span>Updated: {formatDate(post.updated_at)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
