"use client";

import { Loader2Icon } from "lucide-react";
import { useGetPostsSuspense } from "../../../client";
import { useUserContext } from "../../../context/UserContext";
import { LogoutDialog } from "../../features/LogoutDialog";
import { SignUpDialog } from "../../features/SignUpDialog";
import { Button } from "../../ui/Button";
import { EmptyState } from "./components/EmptyState";
import { PostCard } from "./components/PostCard";
import { PostForm } from "./components/PostForm";

export const PostIndex = () => {
  const { sessionStatus } = useUserContext();

  const { data } = useGetPostsSuspense();

  if (data.status !== 200) {
    throw new Error("Failed to get posts");
  }

  const {
    data: { posts },
  } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Posts</h1>
              <p className="text-gray-600">View the latest posts</p>
            </div>
            {/* TODO: SideBar を用意して移植したい */}
            <div className="flex gap-2">
              {sessionStatus === "loading" && (
                <Button variant="outline">
                  <Loader2Icon className="animate-spin" />
                  Loading
                </Button>
              )}

              {/* FIXME: signupMutation の完了前に session が更新されてしまうため常にマウントする */}
              <div className={sessionStatus === "loggedOut" ? "" : "hidden"}>
                <SignUpDialog />
              </div>
              <div className={sessionStatus === "loggedIn" ? "" : "hidden"}>
                <LogoutDialog />
              </div>
            </div>
          </div>

          <PostForm />
        </div>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {posts.map((post) => (
              <div
                key={post.public_id}
                className="min-w-0 w-full max-w-[90%] sm:max-w-full"
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
