import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Music | Daniel O'Brien",
};

export default function MusicPage() {
  return (
    <ComingSoon
      title="Music"
      description="Albums I've released, or will release, linked out to Bandcamp."
    />
  );
}
