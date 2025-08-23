import { beforeEach } from "bun:test";
import { truncateAllTables } from "./initialize";

beforeEach(async () => {
  await truncateAllTables();
});
