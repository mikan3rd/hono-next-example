import { exportOpenAPI } from "./functions";

await exportOpenAPI();

Bun.spawnSync(["biome", "check", "openapi.json", "--write"]);
