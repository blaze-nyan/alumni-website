"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageSquare, Share2, Plus } from "lucide-react"

type Story = {
  id: string
  title: string
  description: string
  createdAt: string
  mediaIds: string[]
  mediaUrls?: string[]
  likes: number
  comments: number
}

export default function ProfileStories({ userId }: { userId: string }) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // In a real app, you would fetch from your API
        const response = await fetch(`/api/users/${userId}/stories`)
        if (!response.ok) {
          throw new Error("Failed to fetch stories")
        }
        const data = await response.json()
        setStories(data)
      } catch (error) {
        console.error("Error fetching stories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [userId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
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
  const demoStories: Story[] =
    stories.length > 0
      ? stories
      : Array.from({ length: 4 }, (_, i) => ({
          id: `story-${i + 1}`,
          title: [
            "My Journey After Graduation",
            "How University Shaped My Career",
            "Lessons Learned in the Real World",
            "Giving Back to My Alma Mater",
          ][i],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
          mediaIds: [`media-${i + 1}`],
          mediaUrls: [`/placeholder.svg?height=200&width=400&text=Story ${i + 1}`],
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 10),
        }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Stories</h2>
        <Button asChild>
          <Link href="/stories/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Story</span>
          </Link>
        </Button>
      </div>

      {demoStories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't shared any stories yet.</p>
          <Button asChild>
            <Link href="/stories/create">Share Your First Story</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoStories.map((story) => (
            <Card key={story.id} className="h-full flex flex-col">
              {story.mediaUrls && story.mediaUrls.length > 0 && (
                <Link href={`/stories/${story.id}`}>
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={story.mediaUrls[0] || "/placeholder.svg"}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </Link>
              )}
              <CardHeader className="pb-2">
                <Link href={`/stories/${story.id}`} className="hover:underline">
                  <h3 className="text-xl font-bold">{story.title}</h3>
                </Link>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <p className="text-muted-foreground line-clamp-3">{story.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(story.createdAt).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{story.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{story.comments}</span>
                  </button>
                  <button className="text-muted-foreground hover:text-primary">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/stories/${story.id}/edit`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

