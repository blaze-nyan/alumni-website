// app/stories/create/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { fetchApi } from "@/lib/api/client"

export default function CreateStoryPage() {
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [author, setAuthor] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
        const res = await fetchApi("/stories", {
            method: "POST",
            body: JSON.stringify({
            storyData: {
                title,
                description,
                author
            },
            mediaDataArray: [],
            }),
        })

        if (!res) throw new Error("Failed to create story")

        router.push("/stories")
        } catch (err) {
        console.error("Error creating story:", err)
        } finally {
        setIsSubmitting(false)
        }
    }

    return (
        <div className="container flex justify-center py-12">
        <Card className="w-full max-w-2xl">
            <CardHeader>
            <CardTitle>Create New Story</CardTitle>
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
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Story"}
                </Button>
            </CardFooter>
            </form>
        </Card>
        </div>
    )
}
