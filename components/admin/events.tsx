"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, MoreHorizontal, Search, Trash, Edit, Users } from "lucide-react"
import { fetchApi } from "@/lib/api/client"
import { useRouter } from "next/navigation"

type Event = {
  eventId: string
  title: string
  author: string
  authorName: string
  calendar: string
  location: string
  status: "upcoming" | "past" | "cancelled"
  attendees: string[] // assuming attendees is an array of userIds or similar
  createdAt: string
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter();

  const goToEvent = (eventId: number | string) => {
    console.log("Viewing event:", eventId);
    router.push(`/events/${eventId}`);
  };


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data: Event[] = await fetchApi("/events")
        
        // Add status field based on calendar date
        const now = new Date()
        const eventsWithStatus = data.map(event => {
          const eventDate = new Date(event.calendar)
          let status: Event["status"] = "upcoming"

          if (eventDate < now) status = "past"
          // If you have an isCancelled or similar field, you can override status here
          // For example: if (event.isCancelled) status = "cancelled"

          return { ...event, status }
        })

        setEvents(eventsWithStatus)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.author.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <p>Loading events...</p>

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <Button className="flex items-center gap-2" asChild>
          <a href="/events/create">
            <span>Create Event</span>
          </a>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.eventId}>
                <TableCell>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.authorName ?? "Unknown"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{new Date(event.calendar).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      event.status === "upcoming" ? "outline" : event.status === "past" ? "secondary" : "destructive"
                    }
                    className={
                      event.status === "upcoming"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : event.status === "past"
                          ? "bg-gray-100 text-gray-800 border-gray-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{event.attendees.length}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => goToEvent(event.eventId)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {event.status === "upcoming" ? (
                        <DropdownMenuItem>Cancel Event</DropdownMenuItem>
                      ) : event.status === "cancelled" ? (
                        <DropdownMenuItem>Restore Event</DropdownMenuItem>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
