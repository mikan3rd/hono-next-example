"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { baseClient } from "../../../baseClient";
import { getHello } from "./client";

export const Index = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["hello"],
    queryFn: getHello,
  });

  const handleClickButton = async () => {
    const res = await baseClient.hellos.$post({ json: { name: "frontend" } });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const json = await res.json();
    // biome-ignore lint/suspicious/noConsole: 削除予定
    console.log(json);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      TEST: {data.message}
      <button type="button" onClick={handleClickButton}>
        Click me
      </button>
    </div>
  );
};
