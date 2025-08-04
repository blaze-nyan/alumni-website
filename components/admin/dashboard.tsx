"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Activity, Users, BookOpen, Calendar, TrendingUp, TrendingDown
} from "lucide-react"
import { fetchApi } from "@/lib/api/client"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, stories, events] = await Promise.all([
          fetchApi("/users"),
          fetchApi("/stories"),
          fetchApi("/events"),
        ])

        const now = new Date()
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(startOfThisMonth.getTime() - 1)

        const newUsersThisMonth = users.filter((u: any) =>
          new Date(u.createdAt) >= startOfThisMonth
        ).length

        const newUsersLastMonth = users.filter((u: any) => {
          const date = new Date(u.createdAt)
          return date >= startOfLastMonth && date <= endOfLastMonth
        }).length

        const userGrowth = newUsersLastMonth > 0
          ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
          : 0

        const newStoriesThisMonth = stories.filter((s: any) =>
          new Date(s.createdAt) >= startOfThisMonth
        ).length

        const upcomingEvents = events.filter((e: any) =>
          new Date(e.calendar) >= now
        ).length

        const recent = users
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map((u: any) => ({
            user: u.username || "New user",
            action: "joined the platform",
            time: new Date(u.createdAt).toLocaleString(),
          }))

        setStats({
          totalUsers: users.length,
          newUsersThisMonth,
          totalStories: stories.length,
          newStoriesThisMonth,
          totalEvents: events.length,
          upcomingEvents,
          userGrowth: parseFloat(userGrowth.toFixed(2)),
          storyGrowth: 8.7, // Optional: Add similar logic if needed
        })

        setRecentActivity(recent)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({ title, icon, value, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          value={stats?.totalUsers}
          description={`+${stats?.newUsersThisMonth} new this month`}
        />
        <StatCard
          title="Total Stories"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          value={stats?.totalStories}
          description={`+${stats?.newStoriesThisMonth} new this month`}
        />
        <StatCard
          title="Total Events"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          value={stats?.totalEvents}
          description={`${stats?.upcomingEvents} upcoming events`}
        />
        <StatCard
          title="User Growth"
          icon={
            stats?.userGrowth > 0
              ? <TrendingUp className="h-4 w-4 text-green-500" />
              : <TrendingDown className="h-4 w-4 text-red-500" />
          }
          value={`${stats?.userGrowth}%`}
          description="Compared to last month"
        />
      </div>

      {/* Activity + Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))
                : recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <Activity className="h-4 w-4 text-primary" />
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
