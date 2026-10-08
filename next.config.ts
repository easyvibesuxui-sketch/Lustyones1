import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML in out/, published to GitHub Pages.
  output: "export",
  // Set by the Pages workflow to "/<repo>"; empty for local builds.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
