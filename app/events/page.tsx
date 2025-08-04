import type { Metadata } from "next";
import EventsGrid from "@/components/events-grid";
import EventsFilter from "@/components/events-filter";

export const metadata: Metadata = {
  title: "Events | RIC Alumni Network",
  description: "Browse upcoming and past events for our alumni community",
};

export default function EventsPage() {
  return (
    <div className="container py-8 md:py-12">
      <EventsGrid />
    </div>
  );
}
