"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { Heart, MessageSquare, Share2 } from "lucide-react"
import { fetchApi } from "@/lib/api/client"
import StoriesFilter from "./stories-filter"

type Story = {
  successStoryId: number | string
  title: string
  description: string
  author: string
  authorId: number
  createdAt: string
  mediaURLs: string[]
  likeCount: number
  commentCount: number
}

export default function StoriesGrid() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { user } = useAuth()

  // New: filter & sort state lifted here
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "popular">("latest")

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true)
        const data = await fetchApi(`/stories`)
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

  // Demo stories for fallback if no real data
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
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "Robert", "Jennifer", "Thomas"][i % 9],
    createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
    mediaURLs: [`media-${i + 1}`],
    likeCount: 0,
    commentCount: 0,
  }))

  // Filter and sort the stories (or demoStories if empty)
  const filteredSortedStories = useMemo(() => {
    const list = stories.length > 0 ? stories : demoStories

    // Filter by searchQuery on title, description, or author
    const filtered = list.filter((story) =>
      [story.title, story.description, story.author]
        .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    // Sort by selected option
    const sorted = filtered.sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sortBy === "popular") {
        return b.likeCount - a.likeCount
      }
      return 0
    })

    return sorted
  }, [stories, demoStories, searchQuery, sortBy])

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
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Success Stories</h1>
          <p className="text-muted-foreground">
            Inspiring journeys and achievements from our alumni community
          </p>
        </div>

        {/* Pass the controlled states and setters to StoriesFilter */}
        <StoriesFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          // optional: onSearch={() => { /* if you want to handle submit */ }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSortedStories.map((story) => (
          <Card key={story.successStoryId} className="h-full flex flex-col">
            <CardHeader className="pb-2">
              {story.mediaURLs && story.mediaURLs.length > 0 ? (
                <div className="h-48 w-full overflow-hidden rounded-t-md">
                  <img
                    src={story.mediaURLs[0]}
                    alt="Story media preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-muted rounded-t-md flex items-center justify-center">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="text-muted-foreground">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                    <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 19l-5-5a2 2 0 0 0-2.83 0l-3.34 3.34a2 2 0 0 1-2.83 0L3 13" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              )}
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
                      {story.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{story.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{story.likeCount}</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{story.commentCount}</span>
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

      {user?.userType === "admin" && (
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
