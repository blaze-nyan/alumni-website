import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Calendar, Users, Award } from "lucide-react"
import FeaturedStories from "@/components/featured-stories"
import UpcomingEvents from "@/components/upcoming-events"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-tertiary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Welcome to the University Alumni Network
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-[600px]">
                Connect with fellow graduates, share your success stories, and stay updated with the latest events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link href="/signup">Join the Network</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Alumni gathering"
                className="rounded-lg shadow-lg"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">What Our Network Offers</h2>
            <p className="text-muted-foreground mt-4 max-w-[700px] mx-auto">
              Discover the benefits of being part of our growing alumni community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Connect with Alumni</h3>
                <p className="text-muted-foreground">
                  Build your professional network with graduates from various years and fields.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-accent/10 text-accent">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Share Success Stories</h3>
                <p className="text-muted-foreground">Inspire others with your achievements and career milestones.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Attend Events</h3>
                <p className="text-muted-foreground">Participate in reunions, workshops, and networking events.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Success Stories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter">Featured Success Stories</h2>
            <Button variant="ghost" className="gap-1" asChild>
              <Link href="/stories">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <FeaturedStories />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter">Upcoming Events</h2>
            <Button variant="ghost" className="gap-1" asChild>
              <Link href="/events">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <UpcomingEvents />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">Ready to Join Our Community?</h2>
          <p className="text-accent-foreground/90 max-w-[600px] mx-auto mb-8">
            Sign up today to connect with fellow alumni, share your stories, and stay updated with the latest events.
          </p>
          <Button size="lg" className="bg-white text-accent hover:bg-white/90" asChild>
            <Link href="/signup">Join Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

