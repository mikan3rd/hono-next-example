import { exportOpenAPI } from "./functions";

(async () => {
  await exportOpenAPI();

  const { stdout } = Bun.spawnSync([
    "bun",
    "--bun",
    "biome",
    "check",
    "openapi.json",
    "--write",
  ]);

  // biome-ignore lint/suspicious/noConsole: 明示的に出力
  console.log(stdout.toString());
})();
