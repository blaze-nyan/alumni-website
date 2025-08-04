"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, SlidersHorizontal } from "lucide-react"

type StoriesFilterProps = {
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: "latest" | "oldest" | "popular"
  setSortBy: (value: "latest" | "oldest" | "popular") => void
}

export default function StoriesFilter({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}: StoriesFilterProps) {

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
    // optionally, add onSearch callback if you want parent notified on submit
  }

  return (
    <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
      <form onSubmit={handleSearch} className="flex w-full md:w-auto">
        <Input
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-r-none"
        />
        <Button type="submit" variant="default" className="rounded-l-none">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Sort</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(value) => setSortBy(value as "latest" | "oldest" | "popular")}
          >
            <DropdownMenuRadioItem value="latest">Latest</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="popular">Most Popular</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
