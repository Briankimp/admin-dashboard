"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getEvents, createEvent, updateEvent, deleteEvent, type Event } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { CalendarIcon, Plus, MoreVertical, Upload, CalendarPlus2Icon as CalendarIcon2, Loader2 } from "lucide-react"
import { ErrorDisplay } from "@/components/error-display"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("10:00")
  const [csvFile, setCsvFile] = useState<File | null>(null)

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date().toISOString(),
    description: "",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    specialServices: false,
  })

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getEvents()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
        setError("Failed to load events. Please try refreshing the page.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleAddEvent = async () => {
    setIsSaving(true)
    try {
      const event = await createEvent(newEvent)
      setEvents([...events, event])
      setIsAddDialogOpen(false)
      resetNewEventForm()
    } catch (error) {
      console.error("Error adding event:", error)
      alert("Failed to add event. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditEvent = async () => {
    if (!selectedEvent) return

    setIsSaving(true)
    try {
      const updatedEvent = await updateEvent(selectedEvent)
      setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating event:", error)
      alert("Failed to update event. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    setIsDeleting(true)
    try {
      await deleteEvent(selectedEvent.id)
      setEvents(events.filter((e) => e.id !== selectedEvent.id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("Failed to delete event. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUploadCSV = async () => {
    if (!csvFile) return

    setIsSaving(true)
    // In a real application, you would send the file to the server
    // For this demo, we'll simulate adding a few events
    try {
      // Simulate processing CSV
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add some mock events
      const newEvents = [
        {
          id: (events.length + 1).toString(),
          title: "Imported Event 1",
          date: new Date().toISOString(),
          description: "This event was imported from CSV",
          image:
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          specialServices: false,
        },
        {
          id: (events.length + 2).toString(),
          title: "Imported Event 2",
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          description: "Another event imported from CSV",
          image:
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          specialServices: true,
        },
      ]

      setEvents([...events, ...newEvents])
      setIsUploadDialogOpen(false)
      setCsvFile(null)
    } catch (error) {
      console.error("Error uploading CSV:", error)
      alert("Failed to process CSV file. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const resetNewEventForm = () => {
    setNewEvent({
      title: "",
      date: new Date().toISOString(),
      description: "",
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      specialServices: false,
    })
    setDate(new Date())
    setTime("10:00")
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      const [hours, minutes] = time.split(":").map(Number)
      const newDate = new Date(date)
      newDate.setHours(hours, minutes)
      setNewEvent({ ...newEvent, date: newDate.toISOString() })
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value)
    if (date) {
      const [hours, minutes] = e.target.value.split(":").map(Number)
      const newDate = new Date(date)
      newDate.setHours(hours, minutes)
      setNewEvent({ ...newEvent, date: newDate.toISOString() })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "PPP")
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "p")
  }

  // Filter events for calendar view
  const calendarEvents = events.reduce(
    (acc, event) => {
      const date = new Date(event.date)
      const dateString = format(date, "yyyy-MM-dd")
      if (!acc[dateString]) {
        acc[dateString] = []
      }
      acc[dateString].push(event)
      return acc
    },
    {} as Record<string, Event[]>,
  )

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Loading events...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorDisplay title="Error Loading Events" message={error} onRetry={() => window.location.reload()} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground">Create and manage events for the MUTCU community</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
          <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => (
                <Card key={event.id}>
                  <CardHeader className="p-4">
                    <div className="aspect-video overflow-hidden rounded-md">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="h-full w-full object-cover transition-all hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="mb-2">
                        {formatDate(event.date)}
                      </Badge>
                      {event.specialServices && <Badge className="mb-2">Special Service</Badge>}
                    </div>
                    <CardTitle className="line-clamp-1 text-xl">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{event.description}</CardDescription>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground">
                      <CalendarIcon2 className="mr-1 h-4 w-4" />
                      {formatTime(event.date)}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex w-full justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEvent(event)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEvent(event)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No events found. Create your first event!</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Event Calendar</CardTitle>
              <CardDescription>View all scheduled events in calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: (date) => {
                      const dateString = format(date, "yyyy-MM-dd")
                      return !!calendarEvents[dateString]
                    },
                  }}
                  modifiersStyles={{
                    hasEvent: {
                      backgroundColor: "hsl(var(--primary) / 0.1)",
                      color: "hsl(var(--primary))",
                      fontWeight: "bold",
                    },
                  }}
                />
              </div>
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Events on {date ? format(date, "PPP") : "Selected Date"}</h3>
                {date && calendarEvents[format(date, "yyyy-MM-dd")] ? (
                  calendarEvents[format(date, "yyyy-MM-dd")].map((event) => (
                    <div key={event.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{formatTime(event.date)}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEvent(event)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEvent(event)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No events scheduled for this date.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>Create a new event for the MUTCU community</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Sunday Service"
                disabled={isSaving}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isSaving}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={time} onChange={handleTimeChange} disabled={isSaving} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Describe the event..."
                rows={3}
                disabled={isSaving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={newEvent.image}
                onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                disabled={isSaving}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="specialServices"
                checked={newEvent.specialServices}
                onCheckedChange={(checked) =>
                  setNewEvent({
                    ...newEvent,
                    specialServices: checked === true,
                  })
                }
                disabled={isSaving}
              />
              <Label htmlFor="specialServices">Special Service</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event details and information</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Event Title</Label>
                <Input
                  id="edit-title"
                  value={selectedEvent.title}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      title: e.target.value,
                    })
                  }
                  disabled={isSaving}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={isSaving}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(new Date(selectedEvent.date), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(selectedEvent.date)}
                        onSelect={(date) => {
                          if (date) {
                            const currentDate = new Date(selectedEvent.date)
                            date.setHours(currentDate.getHours(), currentDate.getMinutes())
                            setSelectedEvent({
                              ...selectedEvent,
                              date: date.toISOString(),
                            })
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={format(new Date(selectedEvent.date), "HH:mm")}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":").map(Number)
                      const date = new Date(selectedEvent.date)
                      date.setHours(hours, minutes)
                      setSelectedEvent({
                        ...selectedEvent,
                        date: date.toISOString(),
                      })
                    }}
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedEvent.description}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  disabled={isSaving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={selectedEvent.image}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      image: e.target.value,
                    })
                  }
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-specialServices"
                  checked={selectedEvent.specialServices}
                  onCheckedChange={(checked) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      specialServices: checked === true,
                    })
                  }
                  disabled={isSaving}
                />
                <Label htmlFor="edit-specialServices">Special Service</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleEditEvent} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Event Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and remove it from the calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload CSV Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Events from CSV</DialogTitle>
            <DialogDescription>Upload a CSV file to bulk import events</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                disabled={isSaving}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>CSV file should have the following columns:</p>
              <ul className="ml-4 list-disc">
                <li>title - Event title</li>
                <li>date - Event date (YYYY-MM-DD)</li>
                <li>time - Event time (HH:MM)</li>
                <li>description - Event description</li>
                <li>image - Image URL (optional)</li>
                <li>specialServices - true/false (optional)</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleUploadCSV} disabled={!csvFile || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

