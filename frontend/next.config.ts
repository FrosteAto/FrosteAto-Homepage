import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("http://localhost:8000/media/photos/**")],
    // The dev API runs on localhost, which Next's SSRF guard blocks by
    // default. Fine here since the URL is hardcoded, not user input, and
    // production points at a real public domain instead - see ROADMAP.md
    // Phase 6 for updating remotePatterns when that domain exists.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
