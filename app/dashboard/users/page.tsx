"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { getUsers, updateUser, type User } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Filter, Loader2, AlertCircle } from "lucide-react"

export default function UsersPage() {
  const { user, isInitialized } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Wait for auth to initialize before checking role
    if (!isInitialized) return

    if (user?.role !== "super_admin") {
      router.push("/dashboard")
      return
    }

    const fetchUsers = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getUsers()
        setUsers(data)
        setFilteredUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users. Please try refreshing the page.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
    // Don't return anything from useEffect
  }, [user, router, isInitialized])

  useEffect(() => {
    let result = users

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter)
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(result)
    // Don't return anything from useEffect
  }, [users, searchQuery, statusFilter, roleFilter])

  const handleEditUser = (user: User) => {
    setSelectedUser({ ...user })
    setIsEditDialogOpen(true)
  }

  const handleSaveUser = async () => {
    if (!selectedUser) return

    setIsSaving(true)
    try {
      const updatedUser = await updateUser(selectedUser)
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Failed to update user. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active"
    const updatedUser = { ...user, status: newStatus }

    try {
      const result = await updateUser(updatedUser)
      setUsers(users.map((u) => (u.id === result.id ? result : u)))
    } catch (error) {
      console.error("Error toggling user status:", error)
      alert("Failed to update user status. Please try again.")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!isInitialized) {
    return (
      <div className="flex h-full items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Initializing...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Loading users...</h2>
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
          <h2 className="text-xl font-semibold">Error Loading Users</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Status: {statusFilter === "all" ? "All" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Role: {roleFilter === "all" ? "All" : roleFilter.replace("_", " ")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRoleFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("super_admin")}>Super Admin</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("admin")}>Admin</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("event_manager")}>Event Manager</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and permissions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: value as User["role"],
                    })
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="event_manager">Event Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedUser.status}
                  onValueChange={(value) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: value as User["status"],
                    })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={isSaving}>
              {isSaving ? (
                <>
                  Saving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

