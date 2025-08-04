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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Eye, 
  MoreHorizontal, 
  Search, 
  Check, 
  X, 
  AlertTriangle, 
  Clock,
  Users,
  FileText,
  CheckCircle
} from "lucide-react"

// Mock data for demo
const mockPendingStories = [
  {
    id: "1",
    successStoryId: 1,
    title: "From Campus to CEO: My Journey in Tech",
    description: "After graduating from RSU with a Computer Science degree, I started my own tech company. This is the story of how determination and the skills I learned at university helped me build a successful business...",
    author: {
      firstname: "John",
      lastname: "Smith",
      username: "johnsmith",
      profileImage: "/placeholder-user.jpg"
    },
    authorId: 101,
    mediaURLs: ["/placeholder.jpg"],
    approved: false,
    likeCount: 0,
    commentCount: 0,
    createdAt: "2025-01-15T10:30:00Z"
  },
  {
    id: "2",
    successStoryId: 2,
    title: "Breaking Barriers in Medical Research",
    description: "My research on cancer treatment methodologies has led to breakthrough discoveries. Here's how my RSU education laid the foundation for this life-changing work...",
    author: {
      firstname: "Dr. Sarah",
      lastname: "Johnson",
      username: "sarahj_md",
      profileImage: "/placeholder-user.jpg"
    },
    authorId: 102,
    mediaURLs: ["/placeholder.jpg", "/placeholder.jpg"],
    approved: false,
    likeCount: 0,
    commentCount: 0,
    createdAt: "2025-01-14T14:20:00Z"
  },
  {
    id: "3",
    successStoryId: 3,
    title: "Building Schools Across Southeast Asia",
    description: "Through my non-profit organization, we've built over 50 schools in rural areas. This mission started during my time at RSU when I realized the importance of accessible education...",
    author: {
      firstname: "Michael",
      lastname: "Chen",
      username: "mchen_edu",
      profileImage: "/placeholder-user.jpg"
    },
    authorId: 103,
    mediaURLs: ["/placeholder.jpg"],
    approved: false,
    likeCount: 0,
    commentCount: 0,
    createdAt: "2025-01-13T09:15:00Z"
  },
  {
    id: "4",
    successStoryId: 4,
    title: "Olympic Gold: A Dream Realized",
    description: "Winning gold at the Olympics was a dream that started during my university years. The discipline and training programs at RSU were instrumental in my athletic success...",
    author: {
      firstname: "Emma",
      lastname: "Davis",
      username: "emma_athlete",
      profileImage: "/placeholder-user.jpg"
    },
    authorId: 104,
    mediaURLs: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    approved: false,
    likeCount: 0,
    commentCount: 0,
    createdAt: "2025-01-12T16:45:00Z"
  }
]

const mockApprovedStories = [
  {
    id: "5",
    successStoryId: 5,
    title: "Sustainable Energy Revolution",
    description: "My company has developed renewable energy solutions that are now used worldwide. The engineering principles I learned at RSU were crucial to this innovation...",
    author: {
      firstname: "David",
      lastname: "Wilson",
      username: "david_green",
      profileImage: "/placeholder-user.jpg"
    },
    authorId: 105,
    mediaURLs: ["/placeholder.jpg"],
    approved: true,
    likeCount: 45,
    commentCount: 12,
    createdAt: "2025-01-10T11:30:00Z"
  },
  {
    id: "6",
    successStoryId: 6,
    title: "Award-Winning Film Director",
    description: "My latest film won the Cannes Film Festival. The creative writing and media studies courses at RSU sparked my passion for storytelling...",
    author: {
      firstname: "Lisa",
      lastname: "Rodriguez",
      username: "lisa_films",
      profileImage: "/placeholder-user.jpg"
    },
    authorId: 106,
    mediaURLs: ["/placeholder.jpg", "/placeholder.jpg"],
    approved: true,
    likeCount: 78,
    commentCount: 23,
    createdAt: "2025-01-08T13:20:00Z"
  }
]

export default function AdminApprovalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [pendingStories, setPendingStories] = useState(mockPendingStories)
  const [approvedStories, setApprovedStories] = useState(mockApprovedStories)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async (storyId: string) => {
    try {
      setActionLoading(storyId)
      setError(null)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Move story from pending to approved
      const storyToApprove = pendingStories.find(s => s.id === storyId)
      if (storyToApprove) {
        const approvedStory = { ...storyToApprove, approved: true }
        setPendingStories(prev => prev.filter(s => s.id !== storyId))
        setApprovedStories(prev => [approvedStory, ...prev])
        setSuccessMessage("Story approved successfully!")
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError("Failed to approve story. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (storyId: string) => {
    if (!confirm("Are you sure you want to reject this story? This action cannot be undone.")) {
      return
    }

    try {
      setActionLoading(storyId)
      setError(null)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove story from pending
      setPendingStories(prev => prev.filter(s => s.id !== storyId))
      setSuccessMessage("Story rejected and deleted successfully!")
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError("Failed to reject story. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const allStories = [...pendingStories, ...approvedStories]

  const filteredPendingStories = pendingStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAllStories = allStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">Story Approval Management</h1>
            <p className="text-muted-foreground">Review and approve pending success stories (Demo Version)</p>
          </div>
          
          {/* Demo Notice */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              This is a demonstration page with mock data. All actions are simulated and do not affect real data.
            </AlertDescription>
          </Alert>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingStories.length}</div>
                <p className="text-xs text-muted-foreground">Stories awaiting review</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Stories</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedStories.length}</div>
                <p className="text-xs text-muted-foreground">Published stories</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{allStories.length}</div>
                <p className="text-xs text-muted-foreground">All stories in system</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Authors</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(allStories.map(s => s.authorId)).size}
                </div>
                <p className="text-xs text-muted-foreground">Unique contributors</p>
              </CardContent>
            </Card>
          </div>

          {/* Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Search */}
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Approval ({pendingStories.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Stories ({allStories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Story Details</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Media</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="w-[140px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingStories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? "No pending stories match your search." : "No stories pending approval."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPendingStories.map((story) => (
                      <TableRow key={story.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm max-w-xs">{story.title}</div>
                            <div className="text-xs text-muted-foreground max-w-xs line-clamp-2">
                              {story.description.substring(0, 120)}...
                            </div>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Pending Review
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">
                              {story.author.firstname} {story.author.lastname}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              @{story.author.username}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {story.mediaURLs?.length ? (
                              <span className="text-blue-600">📷 {story.mediaURLs.length} image(s)</span>
                            ) : (
                              <span className="text-muted-foreground">No media</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(story.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              onClick={() => handleApprove(story.id)}
                              disabled={actionLoading === story.id}
                            >
                              {actionLoading === story.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-t border-green-600"></div>
                              ) : (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                              onClick={() => handleReject(story.id)}
                              disabled={actionLoading === story.id}
                            >
                              {actionLoading === story.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-t border-red-600"></div>
                              ) : (
                                <>
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Story Details</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllStories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? "No stories match your search." : "No stories found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAllStories.map((story) => (
                      <TableRow key={story.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm max-w-xs">{story.title}</div>
                            <div className="text-xs text-muted-foreground max-w-xs line-clamp-2">
                              {story.description.substring(0, 100)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">
                              {story.author.firstname} {story.author.lastname}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              @{story.author.username}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={story.approved ? "outline" : "secondary"}
                            className={
                              story.approved
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {story.approved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <span>👍 {story.likeCount || 0}</span>
                            <span>💬 {story.commentCount || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(story.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
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
                                View Story
                              </DropdownMenuItem>
                              {!story.approved && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApprove(story.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleReject(story.id)}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
