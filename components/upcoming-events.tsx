"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { fetchApi } from "@/lib/api/client";


type Event = {
  eventId: string
  title: string
  description: string
  author: string
  calendar: string // Changed to string to align with API
  location: string
  attendees: string[]
  comments: string[]
  createdAt: string
  mediaURLs: string[]
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data: Event[] = await fetchApi("/events")
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load upcoming events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full mb-4" />
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => new Date(event.calendar) > new Date());
  const displayEvents = upcomingEvents.length > 0 ? upcomingEvents : [];

  return (
  <>
    {displayEvents.length === 0 ? (
      <div className="p-6 text-center text-muted-foreground">
        No upcoming events at the moment.
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayEvents.map((event: Event) => (
          <Card key={event.eventId} className="h-full flex flex-col">
            {/* ... rest of your card content ... */}
            <CardHeader className="pb-2">
              {event.mediaURLs && event.mediaURLs.length > 0 ? (
                <div className="h-48 w-full overflow-hidden rounded-t-md">
                  <img
                    src={event.mediaURLs[0]}
                    alt="Event media preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-muted rounded-t-md flex items-center justify-center">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="text-muted-foreground">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                    <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 19l-5-5a2 2 0 0 0-2.83 0l-3.34 3.34a2 2 0 0 1-2.83 0L3 13" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              )}
              <div className="flex justify-between items-start">
                <Link href={`/events/${event.eventId}`} className="hover:underline">
                  <h3 className="text-xl font-bold">{event.title}</h3>
                </Link>
                <Badge
                  variant="outline"
                  className={
                    new Date(event.calendar) > new Date()
                      ? "bg-accent/10 text-accent border-accent"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {new Date(event.calendar) > new Date() ? "Upcoming" : "Past"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
              <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    {new Date(event.calendar).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{event.attendees.length} attending</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button className="w-full" asChild>
                <Link href={`/events/${event.eventId}`}>
                  {new Date(event.calendar) > new Date() ? "Register" : "View Details"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )}
  </>
);

}
