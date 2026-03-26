"use client";

import { useI18n } from "../../../../../locales/client";

export const EmptyState = () => {
  const t = useI18n();

  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📝</div>
      <p className="text-gray-500 text-lg">{t("posts.empty.title")}</p>
      <p className="text-gray-400">{t("posts.empty.subtitle")}</p>
    </div>
  );
};
