"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getHello, queryKey } from "./client";

export const Index = () => {
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn: getHello,
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      TEST: {data.message}
    </div>
  );
};
