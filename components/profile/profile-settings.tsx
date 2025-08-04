"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { fetchApi } from "@/lib/api/client"

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
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
    };
  };
}

export default function ProfileSettings({ user }: { user: User }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    surName: user.surName,
    email: user.email,
    bio: user.profileData?.bio || "You have not provided a bio yet.",
    location: user.profileData?.location || "N/A",
    graduationYear: user.profileData?.graduationYear || "N/A",
    degree: user.profileData?.degree || "N/A",
    company: user.profileData?.company || "N/A",
    position: user.profileData?.position || "N/A",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e:any) => {
    e.preventDefault();

    if (!user?.userId) {
      toast({ variant: "destructive", title: "Error", description: "User ID is missing" });
      return;
    }

    setIsSubmitting(true);
    try {
          await fetchApi(`/users/${user.userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: String(profileData.firstName || ""),
        surName: String(profileData.surName || ""),
        email: String(profileData.email || ""),
        profileData: {
          bio: String(profileData.bio || ""),
          location: String(profileData.location || ""),
          graduationYear: String(profileData.graduationYear ?? ""),
          degree: String(profileData.degree || ""),
          company: String(profileData.company || ""),
          position: String(profileData.position || ""),
        },
      }),
    });

      toast({ title: "Profile updated", description: "Your profile information has been updated." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Profile update error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your new password and confirmation match.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would send this data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Tabs defaultValue="profile">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Profile Information</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <form onSubmit={handleProfileSubmit}>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First name</Label>
                  <Input id="firstname" name="firstname" value={profileData.firstName} onChange={handleProfileChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last name</Label>
                  <Input id="lastname" name="lastname" value={profileData.surName} onChange={handleProfileChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleProfileChange} rows={4} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={profileData.location} onChange={handleProfileChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    name="graduationYear"
                    value={profileData.graduationYear}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input id="degree" name="degree" value={profileData.degree} onChange={handleProfileChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" value={profileData.company} onChange={handleProfileChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" name="position" value={profileData.position} onChange={handleProfileChange} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="password">
        <Card>
          <form onSubmit={handlePasswordSubmit}>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

