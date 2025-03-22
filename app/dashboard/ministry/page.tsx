"use client"

import { useState, useEffect } from "react"
import {
  getMinistryMembers,
  createMinistryMember,
  updateMinistryMember,
  deleteMinistryMember,
  type MinistryMember,
} from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MoreVertical, Mail, Phone } from "lucide-react"

export default function MinistryPage() {
  const [members, setMembers] = useState<MinistryMember[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<MinistryMember | null>(null)
  const [loading, setLoading] = useState(true)

  // New member form state
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMinistryMembers()
        setMembers(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching ministry members:", error)
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const handleAddMember = async () => {
    try {
      const member = await createMinistryMember(newMember)
      setMembers([...members, member])
      setIsAddDialogOpen(false)
      resetNewMemberForm()
    } catch (error) {
      console.error("Error adding member:", error)
    }
  }

  const handleEditMember = async () => {
    if (!selectedMember) return

    try {
      const updatedMember = await updateMinistryMember(selectedMember)
      setMembers(members.map((m) => (m.id === updatedMember.id ? updatedMember : m)))
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating member:", error)
    }
  }

  const handleDeleteMember = async () => {
    if (!selectedMember) return

    try {
      await deleteMinistryMember(selectedMember.id)
      setMembers(members.filter((m) => m.id !== selectedMember.id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting member:", error)
    }
  }

  const resetNewMemberForm = () => {
    setNewMember({
      name: "",
      role: "",
      email: "",
      phone: "",
      avatar: "/placeholder.svg?height=100&width=100",
    })
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading ministry members...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ministry Management</h1>
          <p className="text-muted-foreground">Manage ministry team members</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.length > 0 ? (
          members.map((member) => (
            <Card key={member.id}>
              <CardHeader className="p-4 text-center">
                <Avatar className="mx-auto h-24 w-24">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-2 text-xl">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.phone}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4">
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
                          setSelectedMember(member)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMember(member)
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
            <p>No ministry members found. Add your first member!</p>
          </div>
        )}
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Ministry Member</DialogTitle>
            <DialogDescription>Add a new member to the ministry team</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                placeholder="Pastor"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="john@mutcu.org"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar URL (Optional)</Label>
              <Input
                id="avatar"
                value={newMember.avatar}
                onChange={(e) => setNewMember({ ...newMember, avatar: e.target.value })}
                placeholder="/placeholder.svg?height=100&width=100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Ministry Member</DialogTitle>
            <DialogDescription>Update ministry member details</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={selectedMember.name}
                  onChange={(e) =>
                    setSelectedMember({
                      ...selectedMember,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Input
                  id="edit-role"
                  value={selectedMember.role}
                  onChange={(e) =>
                    setSelectedMember({
                      ...selectedMember,
                      role: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedMember.email}
                  onChange={(e) =>
                    setSelectedMember({
                      ...selectedMember,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={selectedMember.phone}
                  onChange={(e) =>
                    setSelectedMember({
                      ...selectedMember,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-avatar">Avatar URL</Label>
                <Input
                  id="edit-avatar"
                  value={selectedMember.avatar}
                  onChange={(e) =>
                    setSelectedMember({
                      ...selectedMember,
                      avatar: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ministry member from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMember}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

