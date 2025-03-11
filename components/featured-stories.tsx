"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

type Story = {
  id: string
  title: string
  description: string
  author: {
    id: string
    firstname: string
    lastname: string
    profileImage?: string
  }
  createdAt: string
  mediaIds: string[]
  mediaUrls?: string[]
}

export default function FeaturedStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("/api/stories/featured")
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
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16 mt-1" />
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // For demo purposes, if no stories are fetched yet
  const demoStories: Story[] =
    stories.length > 0
      ? stories
      : [
          {
            id: "1",
            title: "From Campus to CEO: My Journey",
            description:
              "After graduating, I founded a tech startup that's now valued at $50 million. Here's how my university experience shaped my entrepreneurial journey.",
            author: {
              id: "user1",
              firstname: "John",
              lastname: "Smith",
              profileImage: "/placeholder.svg?height=40&width=40",
            },
            createdAt: new Date().toISOString(),
            mediaIds: ["media1"],
            mediaUrls: ["/placeholder.svg?height=200&width=400"],
          },
          {
            id: "2",
            title: "Breaking Barriers in Medical Research",
            description:
              "My research team just received a major grant to continue our work on cancer treatment. I credit my university professors for inspiring this path.",
            author: {
              id: "user2",
              firstname: "Sarah",
              lastname: "Johnson",
              profileImage: "/placeholder.svg?height=40&width=40",
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            mediaIds: ["media2"],
            mediaUrls: ["/placeholder.svg?height=200&width=400"],
          },
          {
            id: "3",
            title: "Building Schools Across Africa",
            description:
              "My nonprofit has built 15 schools in rural communities. The leadership skills I gained during my university years were instrumental to this success.",
            author: {
              id: "user3",
              firstname: "Michael",
              lastname: "Wong",
              profileImage: "/placeholder.svg?height=40&width=40",
            },
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            mediaIds: ["media3"],
            mediaUrls: ["/placeholder.svg?height=200&width=400"],
          },
        ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {demoStories.map((story) => (
        <Link href={`/stories/${story.id}`} key={story.id}>
          <Card className="h-full hover:shadow-md transition-shadow">
            {story.mediaUrls && story.mediaUrls.length > 0 && (
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={story.mediaUrls[0] || "/placeholder.svg"}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <h3 className="text-xl font-bold">{story.title}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">{story.description}</p>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={story.author.profileImage}
                    alt={`${story.author.firstname} ${story.author.lastname}`}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {story.author.firstname[0]}
                    {story.author.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {story.author.firstname} {story.author.lastname}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(story.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

