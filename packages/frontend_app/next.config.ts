import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: "./tsconfig.build.json",
  },
};

export default nextConfig;
