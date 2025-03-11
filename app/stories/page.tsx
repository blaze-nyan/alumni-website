import type { Metadata } from "next"
import StoriesGrid from "@/components/stories-grid"
import StoriesFilter from "@/components/stories-filter"

export const metadata: Metadata = {
  title: "Success Stories | University Alumni Network",
  description: "Browse success stories from our alumni community",
}

export default function StoriesPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Success Stories</h1>
          <p className="text-muted-foreground">Inspiring journeys and achievements from our alumni community</p>
        </div>
        <StoriesFilter />
      </div>
      <StoriesGrid />
    </div>
  )
}

