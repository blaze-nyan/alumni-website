"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, MapPin, Edit } from "lucide-react"

type User = {
  id: string
  username: string
  email: string
  firstname: string
  lastname: string
  usertype: "alumni" | "admin"
  profileImage?: string
  createdAt: string
  updatedAt: string
}

export default function ProfileInfo({ user }: { user: User }) {
  // In a real app, you would fetch additional profile data from your API
  const profileData = {
    bio: "Class of 2018 graduate with a degree in Computer Science. Currently working as a Senior Software Engineer at Tech Corp.",
    location: "San Francisco, CA",
    graduationYear: "2018",
    degree: "Bachelor of Science in Computer Science",
    company: "Tech Corp",
    position: "Senior Software Engineer",
    socialLinks: {
      linkedin: "https://linkedin.com/in/username",
      twitter: "https://twitter.com/username",
      github: "https://github.com/username",
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage
              src={user.profileImage || "/placeholder.svg?height=128&width=128"}
              alt={`${user.firstname} ${user.lastname}`}
            />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
              {user.firstname[0]}
              {user.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full bg-background h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {user.firstname} {user.lastname}
              </h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Edit Profile</Button>
              <Button>Share Profile</Button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p>{profileData.bio}</p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary">
              {profileData.degree}
            </Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
              Class of {profileData.graduationYear}
            </Badge>
            <Badge variant="outline">
              {profileData.position} at {profileData.company}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">12</p>
              <p className="text-muted-foreground">Stories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">8</p>
              <p className="text-muted-foreground">Events Attended</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">156</p>
              <p className="text-muted-foreground">Connections</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

