"use client"

import { useState, useEffect } from "react"
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
import { Eye, MoreHorizontal, Search, Check, X, AlertTriangle } from "lucide-react"
import { getAllStoriesForAdmin, getPendingStories, approveStory, rejectStory, Story } from "@/lib/api/stories"
import { useAuth } from "@/hooks/use-auth"

export default function AdminApproval() {
  const [searchQuery, setSearchQuery] = useState("")
  const [allStories, setAllStories] = useState<Story[]>([])
  const [pendingStories, setPendingStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchStories = async () => {
    if (!user || user.userType !== "admin") {
      setError("Unauthorized access")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const [allStoriesData, pendingStoriesData] = await Promise.all([
        getAllStoriesForAdmin(),
        getPendingStories()
      ])
      
      setAllStories(allStoriesData || [])
      setPendingStories(pendingStoriesData || [])
    } catch (err) {
      console.error("Error fetching stories:", err)
      setError("Failed to fetch stories. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [user])

  const handleApprove = async (storyId: string) => {
    try {
      setActionLoading(storyId)
      setError(null)
      
      const response = await approveStory(storyId)
      setSuccessMessage(response.message || "Story approved successfully!")
      
      // Refresh the stories list
      await fetchStories()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error("Error approving story:", err)
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
      
      const response = await rejectStory(storyId)
      setSuccessMessage(response.message || "Story rejected and deleted successfully!")
      
      // Refresh the stories list
      await fetchStories()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error("Error rejecting story:", err)
      setError("Failed to reject story. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredAllStories = allStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof story.author === 'object' && story.author?.firstname?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof story.author === 'object' && story.author?.lastname?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof story.author === 'string' && story.author.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredPendingStories = pendingStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof story.author === 'object' && story.author?.firstname?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof story.author === 'object' && story.author?.lastname?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof story.author === 'string' && story.author.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (!user || user.userType !== "admin") {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You do not have permission to access this page.
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">Story Approval Management</h2>
          <p className="text-muted-foreground">Review and approve pending success stories</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingStories.length}</div>
              <p className="text-xs text-muted-foreground">Stories awaiting review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Stories</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allStories.filter(s => s.approved === true).length}
              </div>
              <p className="text-xs text-muted-foreground">Published stories</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{allStories.length}</div>
              <p className="text-xs text-muted-foreground">All stories in system</p>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPendingStories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No pending stories match your search." : "No stories pending approval."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPendingStories.map((story) => (
                    <TableRow key={story.id || story.successStoryId}>
                      <TableCell>
                        <div className="font-medium max-w-xs truncate">{story.title}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {story.description?.substring(0, 100)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {typeof story.author === 'object' 
                            ? `${story.author?.firstname || ''} ${story.author?.lastname || ''}`.trim()
                            : story.author
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {typeof story.author === 'object' 
                            ? `@${story.author?.username || ''}`
                            : ''
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">👍 {story.likeCount || story.likes || 0}</span>
                          <span className="text-sm">💬 {story.commentCount || story.comments || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(story.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                            onClick={() => handleApprove(story.id || story.successStoryId?.toString() || "")}
                            disabled={actionLoading === (story.id || story.successStoryId?.toString())}
                          >
                            {actionLoading === (story.id || story.successStoryId?.toString()) ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-t border-green-600"></div>
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            onClick={() => handleReject(story.id || story.successStoryId?.toString() || "")}
                            disabled={actionLoading === (story.id || story.successStoryId?.toString())}
                          >
                            {actionLoading === (story.id || story.successStoryId?.toString()) ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-t border-red-600"></div>
                            ) : (
                              <X className="h-3 w-3" />
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
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Created</TableHead>
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
                    <TableRow key={story.id || story.successStoryId}>
                      <TableCell>
                        <div className="font-medium max-w-xs truncate">{story.title}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {story.description?.substring(0, 100)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {typeof story.author === 'object' 
                            ? `${story.author?.firstname || ''} ${story.author?.lastname || ''}`.trim()
                            : story.author
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {typeof story.author === 'object' 
                            ? `@${story.author?.username || ''}`
                            : ''
                          }
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
                        <div className="flex items-center gap-2">
                          <span className="text-sm">👍 {story.likeCount || story.likes || 0}</span>
                          <span className="text-sm">💬 {story.commentCount || story.comments || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(story.createdAt).toLocaleDateString()}
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
                              View
                            </DropdownMenuItem>
                            {!story.approved && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(story.id || story.successStoryId?.toString() || "")}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleReject(story.id || story.successStoryId?.toString() || "")}
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
  )
}
