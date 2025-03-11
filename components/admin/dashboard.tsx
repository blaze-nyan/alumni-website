"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, BookOpen, Calendar, TrendingUp, TrendingDown } from "lucide-react"

export default function AdminDashboard() {
  // In a real app, you would fetch this data from your API
  const stats = {
    totalUsers: 1245,
    newUsersThisMonth: 87,
    totalStories: 342,
    newStoriesThisMonth: 28,
    totalEvents: 56,
    upcomingEvents: 12,
    userGrowth: 12.4,
    storyGrowth: 8.7,
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+{stats.newUsersThisMonth} new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStories}</div>
            <p className="text-xs text-muted-foreground">+{stats.newStoriesThisMonth} new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">{stats.upcomingEvents} upcoming events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">User Growth</CardTitle>
            {stats.userGrowth > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userGrowth}%</div>
            <p className="text-xs text-muted-foreground">Compared to last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "John Smith", action: "created a new story", time: "2 hours ago" },
                { user: "Admin User", action: "published a new event", time: "5 hours ago" },
                { user: "Sarah Johnson", action: "updated their profile", time: "1 day ago" },
                { user: "Michael Wong", action: "commented on a story", time: "1 day ago" },
                { user: "Emma Davis", action: "registered for an event", time: "2 days ago" },
              ].map((activity, index) => (
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

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Key metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Active Users", value: "876", change: "+12%", isPositive: true },
                { label: "Story Engagement", value: "68%", change: "+5%", isPositive: true },
                { label: "Event Attendance", value: "92%", change: "-3%", isPositive: false },
                { label: "New Registrations", value: "24", change: "+8%", isPositive: true },
                { label: "Average Session", value: "12m 24s", change: "+2m", isPositive: true },
              ].map((metric, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{metric.label}</p>
                    <p className="text-xs text-muted-foreground">Current period</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{metric.value}</p>
                    <p className={`text-xs ${metric.isPositive ? "text-green-500" : "text-red-500"}`}>
                      {metric.change}
                    </p>
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

