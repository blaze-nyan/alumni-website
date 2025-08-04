"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { fetchApi } from "@/lib/api/client" // Adjust path if needed
import ProfileInfo from "@/components/profile/profile-info"

export default function ProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extract userId from URL e.g. /profile/1
  const userId = pathname?.split("/")[2]

  useEffect(() => {
    if (!userId) return

    setLoading(true)
    fetchApi(`/users/${userId}`)
      .then((data: any) => {
        setUser(data)
        setError(null)
      })
      .catch((err: any) => {
        setError(err.message || "Failed to fetch user")
      })
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <div className="container py-8 text-red-600">Error: {error}</div>
  }

  if (!user) {
    return <div className="container py-8">User not found</div>
  }

  return (
    <div className="container py-8">
      <ProfileInfo user={user} />
    </div>
  )
}
