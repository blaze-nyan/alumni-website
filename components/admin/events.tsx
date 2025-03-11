"use client"

import { useState } from "react"
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

type Event = {
  id: string
  title: string
  organizer: string
  date: string
  location: string
  status: "upcoming" | "past" | "cancelled"
  attendees: number
  createdAt: string
}

export default function AdminEvents() {
  const [searchQuery, setSearchQuery] = useState("")

  // In a real app, you would fetch this data from your API
  const events: Event[] = Array.from({ length: 10 }, (_, i) => ({
    id: `event-${i + 1}`,
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
      "Global Alumni Conference",
    ][i],
    organizer: [
      "Alumni Office",
      "Tech Club",
      "Career Services",
      "Student Affairs",
      "Business School",
      "Alumni Association",
      "Community Outreach",
      "Academic Affairs",
      "Campus Relations",
      "International Office",
    ][i],
    date: new Date(Date.now() + (i % 3 === 0 ? -1 : 1) * (i + 1) * 86400000 * 7).toISOString(),
    location: [
      "University Main Campus",
      "Innovation Hub, Downtown",
      "Online (Zoom)",
      "Alumni Center",
      "Conference Center",
      "Grand Hotel",
      "University Stadium",
      "Virtual",
      "Historic Campus Building",
      "International Convention Center",
    ][i],
    status: i % 3 === 0 ? "past" : i === 4 ? "cancelled" : "upcoming",
    attendees: Math.floor(Math.random() * 100) + 10,
    createdAt: new Date(Date.now() - i * 86400000 * 14).toISOString(),
  }))

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
              <TableRow key={event.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.organizer}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
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
                          : ""
                    }
                  >
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{event.attendees}</span>
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
                      <DropdownMenuItem>
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

