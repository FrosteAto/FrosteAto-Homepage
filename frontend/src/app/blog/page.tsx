import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Blog | FrosteAto",
};

export default function BlogPage() {
  return (
    <ComingSoon
      title="Blog"
      description="Posts about whatever I feel like writing about, coming once the blog backend is in place."
    />
  );
}
