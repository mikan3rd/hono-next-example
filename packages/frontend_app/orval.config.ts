import { defineConfig } from "orval";

export default defineConfig({
  client: {
    input: "../backend_app/openapi.json",
    output: {
      client: "react-query",
      target: "./src/client/index.ts",
      httpClient: "fetch",
      mode: "split",
      mock: {
        type: "msw",
        delay: false,
      },
      biome: true,
    },
  },
});
