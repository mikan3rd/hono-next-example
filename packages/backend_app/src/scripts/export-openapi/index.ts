import { exportOpenAPI } from "./functions";

(async () => {
  await exportOpenAPI();

  Bun.spawnSync(["biome", "check", "openapi.json", "--write"]);
})();
