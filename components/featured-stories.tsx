"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeaturedStories, type Story } from "@/lib/api/stories";
import { fetchApi } from "@/lib/api/client";
import { Heart, MessageSquare, Share2 } from "lucide-react";

export default function FeaturedStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data: Story[] = await fetchApi("/stories-popular")
        setStories(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load featured stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

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
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Fallback to demo data if no stories are available

  
  const displayStories =
    stories.length > 0
      ? stories.slice(0, 3)
      : [
          // Your existing demo stories as fallback
          {
            id: "1",
            title: "From Campus to CEO: My Journey",
            description:
              "After graduating, I founded a tech startup that's now valued at $50 million. Here's how my university experience shaped my entrepreneurial journey.",
            author: {
              id: "user1",
              firstname: "John",
              lastname: "Smith",
              username: "jsmith",
              profileImage: "/placeholder.svg?height=40&width=40",
            },
            createdAt: new Date().toISOString(),
            mediaIds: ["media1"],
            mediaUrls: ["/placeholder.svg?height=200&width=400"],
            likes: 42,
            comments: 12,
          },
          // Add other demo stories if needed
        ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {displayStories.map((story) => (
        <Link href={`/stories/${story.successStoryId}`} key={story.id}>
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
                      {typeof story.author === "string"
                        ? story.author.charAt(0).toUpperCase()
                        : (story.author.firstname?.charAt(0).toUpperCase() ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {typeof story.author === "string"
                        ? story.author
                        : story.author.firstname && story.author.lastname
                        ? `${story.author.firstname} ${story.author.lastname}`
                        : story.author.username}
                    </p>
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
        </Link>
      ))}
    </div>
  );
}
