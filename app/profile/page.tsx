"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileInfo from "@/components/profile/profile-info"
import ProfileStories from "@/components/profile/profile-stories"
import ProfileEvents from "@/components/profile/profile-events"
import ProfileSettings from "@/components/profile/profile-settings"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-8">
      <ProfileInfo user={user} />

      <Tabs defaultValue="stories" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stories">My Stories</TabsTrigger>
          <TabsTrigger value="events">My Events</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="mt-6">
          <ProfileStories userId={user.id} />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <ProfileEvents userId={user.id} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <ProfileSettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

