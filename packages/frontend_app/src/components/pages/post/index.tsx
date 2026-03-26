"use client";

import { Loader2Icon } from "lucide-react";
import { useGetPostsSuspense } from "../../../client";
import { useUserContext } from "../../../context/UserContext";
import {
  useChangeLocale,
  useCurrentLocale,
  useI18n,
} from "../../../locales/client";
import { LogoutDialog } from "../../features/LogoutDialog";
import { SignUpDialog } from "../../features/SignUpDialog";
import { Button } from "../../ui/Button";
import { EmptyState } from "./components/EmptyState";
import { PostCard } from "./components/PostCard";
import { PostForm } from "./components/PostForm";

export const PostIndex = () => {
  const t = useI18n();
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();
  const { sessionState } = useUserContext();

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
          <div className="mb-6 flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("posts.title")}
              </h1>
              <p className="text-gray-600">{t("posts.subtitle")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1 border rounded-md p-0.5 bg-white">
                <Button
                  type="button"
                  variant={locale === "en" ? "default" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => changeLocale("en")}
                >
                  {t("locale.switchEn")}
                </Button>
                <Button
                  type="button"
                  variant={locale === "ja" ? "default" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => changeLocale("ja")}
                >
                  {t("locale.switchJa")}
                </Button>
              </div>
              {sessionState.status === "loading" && (
                <Button variant="outline">
                  <Loader2Icon className="animate-spin" />
                  {t("posts.loading")}
                </Button>
              )}

              <div
                className={sessionState.status === "loggedOut" ? "" : "hidden"}
              >
                <SignUpDialog />
              </div>
              <div
                className={sessionState.status === "loggedIn" ? "" : "hidden"}
              >
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
