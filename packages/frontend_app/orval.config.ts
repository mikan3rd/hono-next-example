import { defineConfig } from "orval";

export default defineConfig({
  client: {
    input: "../backend_app/openapi.json",
    output: {
      client: "react-query",
      target: "./src/client/index.ts",
      // biome-ignore lint/suspicious/noTemplateCurlyInString: Embedding env variable
      baseUrl: "${process.env.NEXT_PUBLIC_BACKEND_APP_URL}",
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
