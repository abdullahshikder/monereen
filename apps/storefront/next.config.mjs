import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "monereen.com", pathname: "/monereen-media/**" },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  transpilePackages: ["@monereen/ui", "@monereen/tokens", "@monereen/types", "@monereen/page-builder"],
};

export default nextConfig;
