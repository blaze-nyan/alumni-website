"use client"

import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { fetchApi } from "@/lib/api/client"
import { AuthContext, AuthProvider } from "@/components/auth-provider"

export default function CreateStoryPage() {
    const router = useRouter()
	const { user } = useContext(AuthContext);

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [author, setAuthor] = useState("")
    const [images, setImages] = useState<File[]>([])
    const [mediaDataArray, setMediaDataArray] = useState<
        { dataType: string; base64data: string }[]
    >([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Handle file selection & convert files to base64
    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        setImages(files)

        Promise.all(
        files.map(
            (file) =>
            new Promise<{ dataType: string; base64data: string }>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                const base64data = reader.result as string
                const dataType = file.type.split("/")[0] // e.g. "image"
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
        const author = user.username;
        const res = await fetchApi("/stories", {
            method: "POST",
            body: JSON.stringify({
            storyData: {
                title,
                description,
                author,
            },
            mediaDataArray,
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
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    onChange={handleImagesChange}
                    className="mt-2"
                />
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
