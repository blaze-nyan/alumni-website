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
import EventsFilter from "./events-filter"

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

export default function EventsGrid() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { user } = useAuth()

  // Search + Sort state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
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

  // Filter events by search query only
  const filteredEvents = events.filter((event) => {
    const q = searchQuery.toLowerCase()
    return (
      event.title.toLowerCase().includes(q) ||
      event.author.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q)
    )
  })

  // Sort filtered events by calendar date
  const sortedEvents = filteredEvents.sort((a, b) => {
    const dateA = new Date(a.calendar).getTime()
    const dateB = new Date(b.calendar).getTime()
    return sortBy === "latest" ? dateB - dateA : dateA - dateB
  })

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
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-muted-foreground">
            Connect with fellow alumni at our upcoming events
          </p>
        </div>
        <EventsFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => (
            <Card key={event.eventId} className="h-full flex flex-col">
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
                  <div className="h-48 w-full bg-muted rounded-t-md" />
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
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>

      {loading && page > 1 && (
        <div className="flex justify-center">
          <Skeleton className="h-10 w-32" />
        </div>
      )}

      {user?.userType === "admin" && (
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
