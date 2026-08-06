import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker: traces only the files each page actually
  // needs into .next/standalone, so the runtime image doesn't need
  // node_modules or the source tree at all. See ROADMAP.md Phase 6.
  output: "standalone",
  images: {
    remotePatterns: [
      new URL("http://localhost:8000/media/photos/**"),
      new URL("https://0brien.dev/media/photos/**"),
    ],
    // The dev API runs on localhost, which Next's SSRF guard blocks by
    // default. Fine here since the URL is hardcoded, not user input.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
