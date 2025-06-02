import { exportOpenAPI } from "./functions";

(async () => {
  await exportOpenAPI();

  const { success, stdout } = Bun.spawnSync([
    "bun",
    "--bun",
    "biome",
    "check",
    "openapi.json",
    "--write",
  ]);

  if (success) {
    console.info(stdout.toString());
  } else {
    console.error("biome check failed");
  }
})();
