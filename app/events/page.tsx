import type { Metadata } from "next"
import EventsGrid from "@/components/events-grid"
import EventsFilter from "@/components/events-filter"

export const metadata: Metadata = {
  title: "Events | University Alumni Network",
  description: "Browse upcoming and past events for our alumni community",
}

export default function EventsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-muted-foreground">Connect with fellow alumni at our upcoming events</p>
        </div>
        <EventsFilter />
      </div>
      <EventsGrid />
    </div>
  )
}

