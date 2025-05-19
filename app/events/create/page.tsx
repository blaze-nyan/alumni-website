// app/events/create/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { fetchApi } from "@/lib/api/client"

export default function CreateEventPage() {
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [author, setAuthor] = useState("")
    const [calendar, setCalendar] = useState("")
    const [location, setLocation] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
        const res = await fetchApi("/events", {
            method: "POST",
            body: JSON.stringify({
                eventData: {
                title,
                description,
                author,
                calendar,
                location,
                },
                mediaDataArray: [],
            }),
        })

        if (!res) throw new Error("Failed to create event")

        router.push("/events")
        } catch (err) {
            console.error("Error creating event:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container flex justify-center py-12">
        <Card className="w-full max-w-2xl">
            <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                <div>
                <Label htmlFor="calendar">Event Date & Time</Label>
                <Input id="calendar" type="datetime-local" value={calendar} onChange={(e) => setCalendar(e.target.value)} required />
                </div>
                <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
            </CardFooter>
            </form>
        </Card>
        </div>
    )
}
