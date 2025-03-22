"use client"

import { useState, useEffect } from "react"
import { notifications, type Notification } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Bell } from "lucide-react"

export default function NotificationsPage() {
  const [notificationsList, setNotificationsList] = useState<Notification[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // New notification form state
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    sentTo: "all" as Notification["sentTo"],
    status: "pending" as Notification["status"],
    createdAt: new Date().toISOString(),
  })

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real app, this would be an API call
        setNotificationsList(notifications)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const handleAddNotification = async () => {
    try {
      // In a real app, this would be an API call
      const notification = {
        id: (notificationsList.length + 1).toString(),
        ...newNotification,
      }
      setNotificationsList([notification, ...notificationsList])
      setIsAddDialogOpen(false)
      resetNewNotificationForm()
    } catch (error) {
      console.error("Error adding notification:", error)
    }
  }

  const resetNewNotificationForm = () => {
    setNewNotification({
      title: "",
      message: "",
      sentTo: "all",
      status: "pending",
      createdAt: new Date().toISOString(),
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: Notification["status"]) => {
    switch (status) {
      case "sent":
        return <Badge variant="default">Sent</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return null
    }
  }

  const getRecipientBadge = (sentTo: Notification["sentTo"]) => {
    switch (sentTo) {
      case "all":
        return <Badge variant="secondary">All Users</Badge>
      case "admins":
        return <Badge variant="secondary">Admins</Badge>
      case "event_managers":
        return <Badge variant="secondary">Event Managers</Badge>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading notifications...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Send push notifications to users</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Send Notification
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Notification</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notificationsList.length > 0 ? (
              notificationsList.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground">{notification.message}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRecipientBadge(notification.sentTo)}</TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  <TableCell>{formatDate(notification.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No notifications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Notification Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>Create a new push notification to send to users</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                value={newNotification.title}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    title: e.target.value,
                  })
                }
                placeholder="New Event Added"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newNotification.message}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    message: e.target.value,
                  })
                }
                placeholder="A new event has been added to the calendar."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Select
                value={newNotification.sentTo}
                onValueChange={(value) =>
                  setNewNotification({
                    ...newNotification,
                    sentTo: value as Notification["sentTo"],
                  })
                }
              >
                <SelectTrigger id="recipients">
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admins">Admins</SelectItem>
                  <SelectItem value="event_managers">Event Managers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNotification}>Send Notification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

