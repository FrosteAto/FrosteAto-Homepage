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
      // Backend's Docker-internal hostname (see NEXT_PUBLIC_INTERNAL_API_URL
      // in src/lib/api.ts) - the image optimizer fetches originals from here
      // directly instead of looping out through the public domain.
      new URL("http://backend:8000/media/photos/**"),
    ],
    // The dev API runs on localhost, and the internal backend hostname above
    // resolves to a container's private IP - both trip Next's SSRF guard by
    // default. Fine here since both URLs are hardcoded, not user input.
    dangerouslyAllowLocalIP: true,
  },
  experimental: {
    // Default is 7s (see sharp's .timeout() call in Next's image-optimizer).
    // On a large album, many photos need a fresh resize at once and compete
    // for the same limited CPU - some get starved past 7s and are aborted
    // outright rather than just running slow, showing up as a blank
    // thumbnail that a refresh (now cache-warm) "fixes". Raised well past
    // the worst case observed under real concurrent load (~19s) so a slow
    // resize still finishes instead of being killed.
    imgOptTimeoutInSeconds: 30,
  },
};

export default nextConfig;
