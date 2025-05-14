"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { fetchApi } from "@/lib/api/client"

type Event = {
  eventId: string
  title: string
  description: string
  author: string
  calendar: Date,
  location: string
  attendees: string[]
  createdAt: string
  mediaIDs: string[]
}

export default function EventsGrid() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        // In a real app, you would fetch from your API with pagination
        const data = await fetchApi(`/events`)
        if (page === 1) {
          setEvents(data)
        } else {
          setEvents((prev) => [...prev, ...data])
        }

      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [page])

  // For demo purposes
  const demoEvents: Event[] = Array.from({ length: 9 }, (_, i) => ({
    eventId: `event-${i + 1}`,
    title: [
      "Annual Alumni Reunion",
      "Tech Industry Networking Night",
      "Career Development Workshop",
      "Homecoming Weekend",
      "Entrepreneurship Panel",
      "Alumni Awards Ceremony",
      "Charity Fundraiser Gala",
      "Industry Insights Webinar",
      "Campus Tour & Nostalgia Day",
    ][i % 9],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: ["Admin", "Event", "Career"][i % 3],
    calendar: new Date(Date.now() + (i % 3 === 0 ? -1 : 1) * (i + 1) * 86400000 * 7),
    location: [
      "University Main Campus",
      "Innovation Hub, Downtown",
      "Online (Zoom)",
      "Alumni Center",
      "Conference Center",
    ][i % 5],
    attendees: Array.from({ length: Math.floor(Math.random() * 50) + 5 }, (_, j) => `user-${j}`),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    mediaIDs: i % 2 === 0 ? [`media-${i + 1}`] : [],
  }))

  if (loading && page === 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(events.length > 0 ? events : demoEvents).map((event) => (
          <Card key={event.eventId} className="h-full flex flex-col">
            <CardHeader className="pb-2">
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

      {loading && page > 1 && (
        <div className="flex justify-center">
          <Skeleton className="h-10 w-32" />
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setPage((prev) => prev + 1)}>
            Load More
          </Button>
        </div>
      )}

      {user?.usertype === "admin" && (
        <div className="fixed bottom-6 right-6">
          <Button size="lg" className="rounded-full h-14 w-14 shadow-lg" asChild>
            <Link href="/events/create">
              <span className="text-2xl">+</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

