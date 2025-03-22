"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Users,
  FileText,
  MessageSquare,
  ArrowRight,
  Bell,
  ChevronRight,
  UserPlus,
  Calendar,
  Church,
  BookOpen,
  Loader2,
  AlertCircle,
} from "lucide-react"
import {
  getStats,
  getEvents,
  getFeedbacks,
  getMinistryMembers,
  notifications,
  type Event,
  type Feedback,
  type MinistryMember,
} from "@/lib/data"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalDocuments: 0,
    totalFeedbacks: 0,
    totalMinistryMembers: 0,
  })
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [recentFeedbacks, setRecentFeedbacks] = useState<Feedback[]>([])
  const [ministryMembers, setMinistryMembers] = useState<MinistryMember[]>([])
  const [recentNotifications, setRecentNotifications] = useState(notifications.slice(0, 3))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Use Promise.all to fetch data in parallel
        const [statsData, eventsData, feedbacksData, ministryData] = await Promise.all([
          getStats(),
          getEvents(),
          getFeedbacks(),
          getMinistryMembers(),
        ])

        setStats(statsData)

        const sortedEvents = [...eventsData]
          .filter((event) => new Date(event.date) > new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3)
        setUpcomingEvents(sortedEvents)

        const sortedFeedbacks = [...feedbacksData]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
        setRecentFeedbacks(sortedFeedbacks)

        setMinistryMembers(ministryData.slice(0, 4))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try refreshing the page.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // Don't return anything from useEffect
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Loading dashboard data...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mx-auto w-fit">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome to MUTCU Admin</h1>
        <p className="text-muted-foreground">Overview of your MUTCU mobile app administration</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{stats.activeUsers} active users</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">{stats.totalEvents} total events</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">Uploaded documents</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-highlight">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-highlight" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
            <p className="text-xs text-muted-foreground">Total feedback submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/users">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">User Management</CardTitle>
              <UserPlus className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-xs text-muted-foreground">Manage user accounts and permissions</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto font-normal">
                View <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
        <Link href="/dashboard/events">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Event Management</CardTitle>
              <Calendar className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-xs text-muted-foreground">Create and manage church events</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto font-normal">
                View <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
        <Link href="/dashboard/ministry">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ministry</CardTitle>
              <Church className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-xs text-muted-foreground">Manage ministry team members</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto font-normal">
                View <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
        <Link href="/dashboard/content">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Content</CardTitle>
              <BookOpen className="h-4 w-4 text-highlight" />
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-xs text-muted-foreground">Manage documents and resources</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto font-normal">
                View <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="upcoming-events" className="mt-6">
        <TabsList className="bg-muted">
          <TabsTrigger
            value="upcoming-events"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger
            value="recent-feedback"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Recent Feedback
          </TabsTrigger>
          <TabsTrigger
            value="ministry-team"
            className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            Ministry Team
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-highlight data-[state=active]:text-highlight-foreground"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Events Tab */}
        <TabsContent value="upcoming-events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="mb-2">
                        {formatDate(event.date)}
                      </Badge>
                      {event.specialServices && (
                        <Badge className="mb-2 bg-accent text-accent-foreground">Special Service</Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-1 text-xl">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      {formatTime(event.date)}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No upcoming events</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" asChild>
              <Link href="/dashboard/events">
                View all events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TabsContent>

        {/* Recent Feedback Tab */}
        <TabsContent value="recent-feedback" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentFeedbacks.length > 0 ? (
              recentFeedbacks.map((feedback) => (
                <Card key={feedback.id}>
                  <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <Avatar>
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {feedback.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{feedback.name}</CardTitle>
                      <CardDescription className="text-xs">{formatDate(feedback.createdAt)}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="line-clamp-3 text-sm">{feedback.message}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground">{feedback.email}</p>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No recent feedback</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" asChild>
              <Link href="/dashboard/feedback">
                View all feedback
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TabsContent>

        {/* Ministry Team Tab */}
        <TabsContent value="ministry-team" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ministryMembers.length > 0 ? (
              ministryMembers.map((member) => (
                <Card key={member.id}>
                  <CardHeader className="p-4 text-center">
                    <Avatar className="mx-auto h-16 w-16">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-2 text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col space-y-1 text-sm">
                      <div className="flex items-center">
                        <MessageSquare className="mr-2 h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{member.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No ministry members found</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" asChild>
              <Link href="/dashboard/ministry">
                View all members
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="grid gap-4">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <Card key={notification.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-highlight/10 p-2">
                        <Bell className="h-4 w-4 text-highlight" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{notification.title}</CardTitle>
                        <CardDescription className="mt-1">{notification.message}</CardDescription>
                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                          <span>{formatDate(notification.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <Badge variant="outline" className="text-xs">
                            {notification.sentTo === "all"
                              ? "All Users"
                              : notification.sentTo === "admins"
                                ? "Admins"
                                : "Event Managers"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="text-center">
                <p>No notifications found</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" asChild>
              <Link href="/dashboard/notifications">
                View all notifications
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Activity Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Summary of recent activities across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">New event added</p>
                <p className="text-sm text-muted-foreground">Easter Service was added to the calendar</p>
                <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-secondary/10 p-2">
                <UserPlus className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-sm text-muted-foreground">Emily Davis joined as an event manager</p>
                <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-accent/10 p-2">
                <FileText className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Document uploaded</p>
                <p className="text-sm text-muted-foreground">Ministry Guidelines was uploaded by Robert Johnson</p>
                <p className="text-xs text-muted-foreground mt-1">5 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

