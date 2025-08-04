import type { Metadata } from "next";
import StoriesGrid from "@/components/stories-grid";
import StoriesFilter from "@/components/stories-filter";

export const metadata: Metadata = {
  title: "Success Stories | RIC Alumni Network",
  description: "Browse success stories from our alumni community",
};

export default function StoriesPage() {
  return (
    <div className="container py-8 md:py-12">
      <StoriesGrid />
    </div>
  );
}
