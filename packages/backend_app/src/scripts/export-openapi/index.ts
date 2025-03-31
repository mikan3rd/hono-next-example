import { exportOpenAPI } from "./functions";

(async () => {
  await exportOpenAPI();

  const { success, stdout, stderr } = Bun.spawnSync([
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
    console.error(stderr.toString());
  }
})();
