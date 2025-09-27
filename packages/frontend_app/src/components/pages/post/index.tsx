"use client";

import { useGetPostsSuspense } from "../../../client";
import { useUserContext } from "../../../context/UserContext";
import { LogoutDialog } from "../../features/LogoutDialog";
import { SignUpDialog } from "../../features/SignUpDialog";
import { EmptyState } from "./components/EmptyState";
import { PostCard } from "./components/PostCard";
import { PostForm } from "./components/PostForm";

export const PostIndex = () => {
  const { session } = useUserContext();

  const { data } = useGetPostsSuspense();

  if (data.status !== 200) {
    throw new Error("Failed to get posts");
  }

  const {
    data: { posts },
  } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Posts</h1>
              <p className="text-gray-600">View the latest posts</p>
            </div>
            {session !== undefined && (
              <div className="flex gap-2">
                {/* FIXME: signupMutation の完了前に session が更新されてしまうため常にマウントする */}
                <div className={session === null ? "" : "hidden"}>
                  <SignUpDialog />
                </div>
                <div className={session ? "" : "hidden"}>
                  <LogoutDialog />
                </div>
              </div>
            )}
          </div>

          <PostForm />
        </div>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
