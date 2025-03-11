"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Search, Trash, Edit } from "lucide-react"

type Story = {
  id: string
  title: string
  author: {
    id: string
    name: string
  }
  status: "published" | "draft" | "archived"
  likes: number
  comments: number
  createdAt: string
}

export default function AdminStories() {
  const [searchQuery, setSearchQuery] = useState("")

  // In a real app, you would fetch this data from your API
  const stories: Story[] = Array.from({ length: 10 }, (_, i) => ({
    id: `story-${i + 1}`,
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
      "Transforming Education in Rural Areas",
    ][i],
    author: {
      id: `user-${i + 1}`,
      name: [
        "John Smith",
        "Sarah Johnson",
        "Michael Wong",
        "Emma Davis",
        "David Miller",
        "Lisa Wilson",
        "Robert Brown",
        "Jennifer Taylor",
        "Thomas Anderson",
        "Jane Doe",
      ][i],
    },
    status: [
      "published",
      "published",
      "published",
      "draft",
      "published",
      "archived",
      "published",
      "draft",
      "published",
      "published",
    ][i],
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
    createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
  }))

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <Button className="flex items-center gap-2" asChild>
          <a href="/stories/create">
            <span>Create Story</span>
          </a>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStories.map((story) => (
              <TableRow key={story.id}>
                <TableCell>
                  <div className="font-medium">{story.title}</div>
                </TableCell>
                <TableCell>{story.author.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      story.status === "published" ? "outline" : story.status === "draft" ? "secondary" : "destructive"
                    }
                    className={
                      story.status === "published"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : story.status === "draft"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                    }
                  >
                    {story.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">👍 {story.likes}</span>
                    <span className="text-sm">💬 {story.comments}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(story.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {story.status === "published" ? (
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      ) : story.status === "archived" ? (
                        <DropdownMenuItem>Publish</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>Publish</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

