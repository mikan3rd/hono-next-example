import { vi } from "vitest";

export const createBrowserClient = vi.fn();

console.log("createBrowserClient", createBrowserClient);
