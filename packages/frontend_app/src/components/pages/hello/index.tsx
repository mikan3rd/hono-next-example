"use client";

// FIXME:
// I get an error when I use absolute paths by setting paths in the import source tsconfig.
// Also, if I prepare paths for absolute paths in the root tsconfig of monorepo, typecheck passes, but next build fails.
import type { AppType } from "backend_app/src/apps";
import { hc } from "hono/client";

export const Index = () => {
  const client = hc<AppType>("http://localhost:4300/");

  const handleClickButton = async () => {
    const res = await client.hellos.$get();
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
