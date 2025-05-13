"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { Heart, MessageSquare, Share2 } from "lucide-react"
import { fetchApi } from "@/lib/api/client"

type Story = {
  successStoryId: number
  title: string
  description: string
  author: string
  createdAt: string
  mediaIDs: string[]
}

export default function StoriesGrid() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true)
        // In a real app, you would fetch from your API with pagination
        const data = await fetchApi(`/stories`)
        console.log(data)
        if (page === 1) {
          setStories(data)
        } else {
          setStories((prev) => [...prev, ...data])
        }

      } catch (error) {
        console.error("Error fetching stories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [page])

  // For demo purposes
  const demoStories = Array.from({ length: 9 }, (_, i) => ({
    successStoryId: `story-${i + 1}`,
    title: [
      "From Campus to CEO: My Journey",
      "Breaking Barriers in Medical Research",
      "Building Schools Across Africa",
      "My Olympic Gold Medal Journey",
      "Revolutionizing Sustainable Energy",
      "Creating Award-Winning Films",
      "Leading Humanitarian Efforts",
      "Pioneering AI Research",
      "Building a Global Fashion Brand",
    ][i % 9],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "Robert", "Jennifer", "Thomas"][i % 9],
    createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
    mediaIds: [`media-${i + 1}`],
    mediaUrls: [`/placeholder.svg?height=200&width=400&text=Story ${i + 1}`],
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
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
              <div className="flex items-center gap-2 w-full">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16 mt-1" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(stories.length > 0 ? stories : demoStories).map((story) => (
          <Card key={story.successStoryId} className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <Link href={`/stories/${story.successStoryId}`} className="hover:underline">
                <h3 className="text-xl font-bold">{story.title}</h3>
              </Link>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
              <p className="text-muted-foreground line-clamp-3">{story.description}</p>
            </CardContent>
            <CardFooter className="pt-2 flex flex-col gap-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {story.author}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {story.author}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(story.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{1}</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{1}</span>
                  </button>
                  <button className="text-muted-foreground hover:text-primary">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
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

      {user && (
        <div className="fixed bottom-6 right-6">
          <Button size="lg" className="rounded-full h-14 w-14 shadow-lg" asChild>
            <Link href="/stories/create">
              <span className="text-2xl">+</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

