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

  console.info(stdout.toString());
})();
