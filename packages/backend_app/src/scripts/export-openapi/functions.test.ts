import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import * as fs from "node:fs/promises";
import { app } from "../../apps";
import { exportOpenAPI } from "./functions";

describe("exportOpenAPI", () => {
  beforeEach(() => {
    mock.module("node:fs/promises", () => ({
      writeFile: mock(async () => {}),
    }));
    spyOn(console, "log");
    spyOn(app, "request");
  });

  afterEach(() => {
    mock.restore();
  });

  const subject = async () => exportOpenAPI();

  it("", async () => {
    await subject();
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith("OpenAPI exported successfully");
  });

  describe("app.request is not 200", () => {
    beforeEach(() => {
      spyOn(app, "request").mockImplementation(async () => {
        const response = new Response("Internal Server Error", { status: 500 });
        return response;
      });
    });

    it("throw error", async () => {
      await expect(subject()).rejects.toThrow(
        "Failed to export OpenAPI: Internal Server Error",
      );
      expect(fs.writeFile).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });
  });
});
