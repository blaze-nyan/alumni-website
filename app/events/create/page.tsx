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
    const [mediaDataArray, setMediaDataArray] = useState<
        { dataType: string; base64data: string }[]
    >([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Convert selected files to base64 and store with dataType
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)

        Promise.all(
        files.map(
            (file) =>
            new Promise<{ dataType: string; base64data: string }>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                const base64data = reader.result as string
                const dataType = file.type.split("/")[0] // "image", "video", etc.
                resolve({ dataType, base64data })
                }
                reader.onerror = () => reject(new Error("File reading failed"))
                reader.readAsDataURL(file)
            })
        )
        )
        .then((results) => setMediaDataArray(results))
        .catch((err) => console.error("Failed to read files:", err))
    }

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
            mediaDataArray,
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
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                </div>
                <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                <div>
                <Label htmlFor="calendar">Event Date & Time</Label>
                <Input
                    id="calendar"
                    type="datetime-local"
                    value={calendar}
                    onChange={(e) => setCalendar(e.target.value)}
                    required
                />
                </div>
                <div>
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                </div>
                <div>
                <Label htmlFor="media">Upload Images</Label>
                <Input
                    id="media"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="mt-2"
                />
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
