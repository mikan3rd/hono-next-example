"use client";

import { client } from "../../../client";

export const Index = () => {
  const handleClickButton = async () => {
    const res = await client.hellos.$post({ json: { name: "frontend" } });
    const json = await res.json();
    // biome-ignore lint/suspicious/noConsole: 明示的に出力
    console.log(json);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      TEST
      <button type="button" onClick={handleClickButton}>
        Click me
      </button>
    </div>
  );
};
