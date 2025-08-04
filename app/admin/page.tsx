"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminDashboard from "@/components/admin/dashboard"
import AdminUsers from "@/components/admin/users"
import AdminStories from "@/components/admin/stories"
import AdminEvents from "@/components/admin/events"
import AdminApproval from "@/components/admin/approval"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.userType !== "admin")) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.userType !== "admin") {
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="approval">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="approval">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="approval" className="mt-6">
          <AdminApproval />
        </TabsContent>
      </Tabs>
    </div>
  )
}

