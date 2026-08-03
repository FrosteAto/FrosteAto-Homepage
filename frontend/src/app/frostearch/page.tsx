import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "FrosteArch | FrosteAto",
};

export default function FrosteArchPage() {
  return (
    <ComingSoon
      title="FrosteArch"
      description="A whole page dedicated to my custom Linux ISO. Details, downloads, and documentation are on the way."
    />
  );
}
