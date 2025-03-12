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
import { getUpcomingEvents, type Event } from "@/lib/api/events";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingEvents();
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

  // Fallback to demo data if no events are available
  const displayEvents =
    events.length > 0
      ? events
      : [
          // Your existing demo events as fallback
          {
            id: "1",
            title: "Annual Alumni Reunion",
            description:
              "Join us for our biggest event of the year! Network with fellow alumni, enjoy great food, and hear inspiring talks from distinguished graduates.",
            author: {
              id: "admin1",
              firstname: "Admin",
              lastname: "User",
              username: "admin",
              profileImage: "/placeholder.svg?height=40&width=40",
            },
            calendar: {
              date: new Date(Date.now() + 1209600000).toISOString(), // 2 weeks from now
              location: "University Main Campus",
            },
            attendees: ["user1", "user2", "user3"],
            createdAt: new Date().toISOString(),
            mediaIds: ["media1"],
            mediaUrls: ["/placeholder.svg?height=200&width=400"],
          },
          // Add other demo events if needed
        ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {displayEvents.map((event) => (
        <Card key={event.id} className="h-full flex flex-col">
          {event.mediaUrls && event.mediaUrls.length > 0 && (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={event.mediaUrls[0] || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold">{event.title}</h3>
              <Badge
                variant="outline"
                className="bg-accent/10 text-accent border-accent"
              >
                {new Date(event.calendar.date) > new Date()
                  ? "Upcoming"
                  : "Past"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {event.description}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {new Date(event.calendar.date).toLocaleDateString(undefined, {
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
                <span>{event.calendar.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span>{event.attendees.length} attending</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/events/${event.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
