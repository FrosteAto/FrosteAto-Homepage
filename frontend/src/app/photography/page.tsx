import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Photography | Daniel O'Brien",
};

export default function PhotographyPage() {
  return (
    <ComingSoon
      title="Photography"
      description="A gallery of the pictures I take. This page will grow into a full album viewer once the photo backend is wired up."
    />
  );
}
