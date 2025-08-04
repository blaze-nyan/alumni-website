"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"


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

export default function ProfileEvents({ userId }: { userId: string }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // In a real app, you would fetch from your API
        const response = await fetch(`/api/users/${userId}/events`)
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [userId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
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
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // For demo purposes
  const demoEvents: Event[] =
    events.length > 0
      ? events
      : []

  const upcomingEvents = demoEvents.filter((event) => new Date(event.calendar) > new Date())
  const pastEvents = demoEvents.filter((event) => new Date(event.calendar) <= new Date())

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground mb-4">You're not registered for any upcoming events.</p>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.eventId} className="h-full flex flex-col">
                {event.mediaURLs && event.mediaURLs.length > 0 && (
                  <Link href={`/events/${event.eventId}`}>
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={event.mediaURLs[0] || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  </Link>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Link href={`/events/${event.mediaURLs}`} className="hover:underline">
                      <h3 className="text-xl font-bold">{event.title}</h3>
                    </Link>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                      Registered
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
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/events/${event.eventId}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Past Events</h2>

        {pastEvents.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">You haven't attended any events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <Card key={event.eventId} className="h-full flex flex-col">
                {event.mediaURLs && event.mediaURLs.length > 0 && (
                  <Link href={`/events/${event.eventId}`}>
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={event.mediaURLs[0] || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  </Link>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Link href={`/events/${event.eventId}`} className="hover:underline">
                      <h3 className="text-xl font-bold">{event.title}</h3>
                    </Link>
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      Attended
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
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/events/${event.eventId}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

