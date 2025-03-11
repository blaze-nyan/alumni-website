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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, UserPlus } from "lucide-react"

type User = {
  id: string
  username: string
  email: string
  firstname: string
  lastname: string
  usertype: "alumni" | "admin"
  status: "active" | "inactive" | "pending"
  createdAt: string
  profileImage?: string
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("")

  // In a real app, you would fetch this data from your API
  const users: User[] = Array.from({ length: 10 }, (_, i) => ({
    id: `user-${i + 1}`,
    username: ["jsmith", "sjohnson", "mwong", "edavis", "dmiller", "lwilson", "rbrown", "jtaylor", "tanderson", "jdoe"][
      i
    ],
    email: [
      `${["john", "sarah", "michael", "emma", "david", "lisa", "robert", "jennifer", "thomas", "jane"][i]}@example.com`,
    ],
    firstname: ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "Robert", "Jennifer", "Thomas", "Jane"][i],
    lastname: ["Smith", "Johnson", "Wong", "Davis", "Miller", "Wilson", "Brown", "Taylor", "Anderson", "Doe"][i],
    usertype: i === 0 || i === 5 ? "admin" : "alumni",
    status: ["active", "active", "active", "inactive", "active", "active", "pending", "active", "active", "inactive"][
      i
    ],
    createdAt: new Date(Date.now() - i * 86400000 * 30).toISOString(),
    profileImage: `/placeholder.svg?height=40&width=40&text=${i + 1}`,
  }))

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage} alt={`${user.firstname} ${user.lastname}`} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user.firstname[0]}
                        {user.lastname[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.usertype === "admin" ? "default" : "outline"}>{user.usertype}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "active" ? "outline" : user.status === "inactive" ? "secondary" : "destructive"
                    }
                    className={
                      user.status === "active"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : user.status === "inactive"
                          ? "bg-gray-100 text-gray-800 border-gray-200"
                          : ""
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      {user.status === "active" ? (
                        <DropdownMenuItem>Deactivate</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>Activate</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

