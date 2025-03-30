import * as fs from "node:fs/promises";
import { app } from "../../apps";

export const exportOpenAPI = async () => {
  const res = await app.request("/doc");
  const text = await res.text();
  if (res.status !== 200) {
    throw new Error(`Failed to export OpenAPI: ${text}`);
  }
  await fs.writeFile("openapi.json", text);

  console.info("OpenAPI exported successfully");
};
