"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, MapPin, Edit } from "lucide-react"

type User = {
  userId: string
  username: string
  email: string
  firstName: string
  surName: string
  userType: "alumni" | "admin"
  profileImage?: string
  createdAt: string
  updatedAt: string
  profileData?: {
    bio?: string;
    location?: string;
    graduationYear?: string;
    degree?: string;
    company?: string;
    position?: string;
    department?: string;
    faculty?: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
    };
  };
}

export default function ProfileInfo({ user }: { user: User }) {

  const placeholder = {
    bio: "This user has not provided a bio yet.",
    location: "N/A",
    graduationYear: "N/A",
    faculty: "N/A",
    department: "N/A",
    degree: "N/A",
    company: "N/A",
    position: "N/A",
    socialLinks: {
      linkedin: "N/A",
      twitter: "N/A",
      github: "N/A",
    },
  };

  console.log("User data:", user);

  const profileData = {
    bio: user.profileData?.bio || placeholder.bio,
    location: user.profileData?.location || placeholder.location,
    graduationYear: user.profileData?.graduationYear || placeholder.graduationYear,
    degree: user.profileData?.degree || placeholder.degree,
    company: user.profileData?.company || placeholder.company,
    position: user.profileData?.position || placeholder.position,
    department: user.profileData?.department || placeholder.department,
    faculty: user.profileData?.faculty || placeholder.faculty,
    socialLinks: {
      linkedin: user.profileData?.socialLinks?.linkedin || placeholder.socialLinks.linkedin,
      twitter: user.profileData?.socialLinks?.twitter || placeholder.socialLinks.twitter,
      github: user.profileData?.socialLinks?.github || placeholder.socialLinks.github,
    },
  };

  console.log(user.firstName)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
              {user.firstName[0]}
              {user.surName[0]}
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
                {user.firstName} {user.surName}
              </h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  console.log(process.env.NEXT_PUBLIC_APP_URL)
                  const url = `${process.env.NEXT_PUBLIC_APP_URL}/profile/${user.userId}`;
                  navigator.clipboard.writeText(url);
                }}
              >
                Share Profile
              </Button>
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
            <Badge variant="outline">
              Alumni of {profileData.faculty} at {profileData.department}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">12</p>
              <p className="text-muted-foreground">Stories Featured</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">8</p>
              <p className="text-muted-foreground">Events Attended</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

