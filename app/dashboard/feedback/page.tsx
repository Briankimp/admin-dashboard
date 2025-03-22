"use client"

import { useState, useEffect } from "react"
import {
  getFeedbacks,
  getFeedbackForms,
  createFeedbackForm,
  updateFeedbackForm,
  deleteFeedbackForm,
  type Feedback,
  type FeedbackForm,
} from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, MoreVertical, ExternalLink } from "lucide-react"

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([])
  const [isAddFormDialogOpen, setIsAddFormDialogOpen] = useState(false)
  const [isEditFormDialogOpen, setIsEditFormDialogOpen] = useState(false)
  const [isDeleteFormDialogOpen, setIsDeleteFormDialogOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState<FeedbackForm | null>(null)
  const [loading, setLoading] = useState(true)

  // New form state
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    url: "",
    createdAt: new Date().toISOString(),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbacksData = await getFeedbacks()
        setFeedbacks(feedbacksData)

        const formsData = await getFeedbackForms()
        setFeedbackForms(formsData)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching feedback data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddForm = async () => {
    try {
      const form = await createFeedbackForm(newForm)
      setFeedbackForms([...feedbackForms, form])
      setIsAddFormDialogOpen(false)
      resetNewFormForm()
    } catch (error) {
      console.error("Error adding form:", error)
    }
  }

  const handleEditForm = async () => {
    if (!selectedForm) return

    try {
      const updatedForm = await updateFeedbackForm(selectedForm)
      setFeedbackForms(feedbackForms.map((f) => (f.id === updatedForm.id ? updatedForm : f)))
      setIsEditFormDialogOpen(false)
    } catch (error) {
      console.error("Error updating form:", error)
    }
  }

  const handleDeleteForm = async () => {
    if (!selectedForm) return

    try {
      await deleteFeedbackForm(selectedForm.id)
      setFeedbackForms(feedbackForms.filter((f) => f.id !== selectedForm.id))
      setIsDeleteFormDialogOpen(false)
    } catch (error) {
      console.error("Error deleting form:", error)
    }
  }

  const resetNewFormForm = () => {
    setNewForm({
      title: "",
      description: "",
      url: "",
      createdAt: new Date().toISOString(),
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading feedback data...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground">Manage feedback forms and view submissions</p>
      </div>

      <Tabs defaultValue="submissions">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="forms">Feedback Forms</TabsTrigger>
          </TabsList>
          <Button onClick={() => setIsAddFormDialogOpen(true)} className="sm:self-end">
            <Plus className="mr-2 h-4 w-4" />
            Add Form
          </Button>
        </div>

        <TabsContent value="submissions" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <Card key={feedback.id}>
                  <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <Avatar>
                      <AvatarFallback>{feedback.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{feedback.name}</CardTitle>
                      <CardDescription className="text-xs">{formatDate(feedback.createdAt)}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">{feedback.message}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground">{feedback.email}</p>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No feedback submissions yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {feedbackForms.length > 0 ? (
              feedbackForms.map((form) => (
                <Card key={form.id}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-xl">{form.title}</CardTitle>
                    <CardDescription>Created on {formatDate(form.createdAt)}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">{form.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4">
                    <Button variant="outline" asChild>
                      <a href={form.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Form
                      </a>
                    </Button>
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
                            setSelectedForm(form)
                            setIsEditFormDialogOpen(true)
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedForm(form)
                            setIsDeleteFormDialogOpen(true)
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No feedback forms created yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Form Dialog */}
      <Dialog open={isAddFormDialogOpen} onOpenChange={setIsAddFormDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Feedback Form</DialogTitle>
            <DialogDescription>Create a new Google Form for collecting feedback</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                value={newForm.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                placeholder="Sunday Service Feedback"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                placeholder="Share your thoughts on our Sunday services"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">Google Form URL</Label>
              <Input
                id="url"
                value={newForm.url}
                onChange={(e) => setNewForm({ ...newForm, url: e.target.value })}
                placeholder="https://forms.google.com/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFormDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddForm}>Add Form</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={isEditFormDialogOpen} onOpenChange={setIsEditFormDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Feedback Form</DialogTitle>
            <DialogDescription>Update the feedback form details</DialogDescription>
          </DialogHeader>
          {selectedForm && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Form Title</Label>
                <Input
                  id="edit-title"
                  value={selectedForm.title}
                  onChange={(e) =>
                    setSelectedForm({
                      ...selectedForm,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedForm.description}
                  onChange={(e) =>
                    setSelectedForm({
                      ...selectedForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-url">Google Form URL</Label>
                <Input
                  id="edit-url"
                  value={selectedForm.url}
                  onChange={(e) =>
                    setSelectedForm({
                      ...selectedForm,
                      url: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditFormDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditForm}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Form Dialog */}
      <AlertDialog open={isDeleteFormDialogOpen} onOpenChange={setIsDeleteFormDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the feedback form from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteForm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

