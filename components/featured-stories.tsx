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

export default function FeaturedStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedStories();
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
      ? stories
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
              <p className="text-muted-foreground line-clamp-3">
                {story.description}
              </p>
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
                  <p className="text-xs text-muted-foreground">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
