// TODO: delete
import { hc } from "hono/client";
import type { AppType } from "../src/apps/index.js";

const client = hc<AppType>("http://localhost:8787/");

const res = await client.hellos.$get();
const json = await res.json();
