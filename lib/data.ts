// Mock data for the admin dashboard
// In a real application, this would be fetched from a database

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "super_admin" | "event_manager"
  status: "active" | "inactive"
  createdAt: string
  lastLogin: string
  avatar: string
}

export type Event = {
  id: string
  title: string
  date: string
  description: string
  image: string
  specialServices: boolean
}

export type Document = {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadedAt: string
  url: string
}

export type Feedback = {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

export type FeedbackForm = {
  id: string
  title: string
  description: string
  url: string
  createdAt: string
}

export type MinistryMember = {
  id: string
  name: string
  role: string
  email: string
  phone: string
  avatar: string
}

export type Notification = {
  id: string
  title: string
  message: string
  createdAt: string
  sentTo: "all" | "admins" | "event_managers"
  status: "sent" | "pending" | "failed"
}

// Mock Users
export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@mutcu.org",
    role: "super_admin",
    status: "active",
    createdAt: "2023-01-15T09:24:00",
    lastLogin: "2023-03-22T14:30:00",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@mutcu.org",
    role: "admin",
    status: "active",
    createdAt: "2023-01-20T10:15:00",
    lastLogin: "2023-03-21T11:45:00",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@mutcu.org",
    role: "event_manager",
    status: "active",
    createdAt: "2023-02-05T08:30:00",
    lastLogin: "2023-03-20T16:20:00",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@mutcu.org",
    role: "event_manager",
    status: "inactive",
    createdAt: "2023-02-10T14:45:00",
    lastLogin: "2023-03-01T09:10:00",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael@mutcu.org",
    role: "admin",
    status: "active",
    createdAt: "2023-02-15T11:20:00",
    lastLogin: "2023-03-22T10:05:00",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Mock Events
export const events: Event[] = [
  {
    id: "1",
    title: "Sunday Service",
    date: "2023-04-02T10:00:00",
    description: "Regular Sunday worship service with praise and sermon.",
    image:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    specialServices: false,
  },
  {
    id: "2",
    title: "Prayer Meeting",
    date: "2023-04-05T19:00:00",
    description: "Midweek prayer meeting for all members.",
    image:
      "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    specialServices: false,
  },
  {
    id: "3",
    title: "Easter Service",
    date: "2023-04-09T10:00:00",
    description: "Special Easter Sunday celebration service.",
    image:
      "https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1422&q=80",
    specialServices: true,
  },
  {
    id: "4",
    title: "Youth Fellowship",
    date: "2023-04-14T18:00:00",
    description: "Fellowship meeting for youth members.",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    specialServices: false,
  },
  {
    id: "5",
    title: "Bible Study",
    date: "2023-04-19T19:00:00",
    description: "In-depth Bible study session for all members.",
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    specialServices: false,
  },
  {
    id: "6",
    title: "Community Outreach",
    date: "2023-04-22T09:00:00",
    description: "Community service and outreach program.",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd59a93f9724?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    specialServices: true,
  },
]

// Mock Documents
export const documents: Document[] = [
  {
    id: "1",
    name: "Semester Calendar",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "John Doe",
    uploadedAt: "2023-03-01T10:15:00",
    url: "#",
  },
  {
    id: "2",
    name: "MUTCU Constitution",
    type: "DOCX",
    size: "1.8 MB",
    uploadedBy: "Jane Smith",
    uploadedAt: "2023-02-15T14:30:00",
    url: "#",
  },
  {
    id: "3",
    name: "Ministry Guidelines",
    type: "PDF",
    size: "3.2 MB",
    uploadedBy: "Robert Johnson",
    uploadedAt: "2023-03-10T09:45:00",
    url: "#",
  },
  {
    id: "4",
    name: "Event Planning Template",
    type: "XLSX",
    size: "1.5 MB",
    uploadedBy: "Emily Davis",
    uploadedAt: "2023-02-28T16:20:00",
    url: "#",
  },
  {
    id: "5",
    name: "Budget Report",
    type: "PDF",
    size: "2.1 MB",
    uploadedBy: "Michael Wilson",
    uploadedAt: "2023-03-15T11:10:00",
    url: "#",
  },
]

// Mock Feedback
export const feedbacks: Feedback[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    message: "The Sunday service was very inspiring. I particularly enjoyed the worship session.",
    createdAt: "2023-03-20T14:25:00",
  },
  {
    id: "2",
    name: "David Brown",
    email: "david@example.com",
    message: "I think we should have more youth activities. The current ones are great but limited.",
    createdAt: "2023-03-19T10:40:00",
  },
  {
    id: "3",
    name: "Lisa Wilson",
    email: "lisa@example.com",
    message: "The prayer meeting was powerful. I felt a strong presence of the Holy Spirit.",
    createdAt: "2023-03-18T16:15:00",
  },
  {
    id: "4",
    name: "Mark Thompson",
    email: "mark@example.com",
    message: "The Bible study sessions are very informative. I learn something new every time.",
    createdAt: "2023-03-17T09:30:00",
  },
  {
    id: "5",
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    message: "I appreciate the community outreach programs. They really make a difference.",
    createdAt: "2023-03-16T13:50:00",
  },
]

// Mock Feedback Forms
export const feedbackForms: FeedbackForm[] = [
  {
    id: "1",
    title: "Sunday Service Feedback",
    description: "Share your thoughts on our Sunday services",
    url: "https://forms.google.com/sunday-service",
    createdAt: "2023-02-01T09:00:00",
  },
  {
    id: "2",
    title: "Youth Program Feedback",
    description: "Help us improve our youth programs",
    url: "https://forms.google.com/youth-program",
    createdAt: "2023-02-15T14:30:00",
  },
  {
    id: "3",
    title: "General Feedback",
    description: "Share any feedback or suggestions",
    url: "https://forms.google.com/general-feedback",
    createdAt: "2023-03-01T11:45:00",
  },
]

// Mock Ministry Members
export const ministryMembers: MinistryMember[] = [
  {
    id: "1",
    name: "Pastor James Wilson",
    role: "Senior Pastor",
    email: "pastor.james@mutcu.org",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Mary Johnson",
    role: "Worship Leader",
    email: "mary@mutcu.org",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Thomas Brown",
    role: "Youth Pastor",
    email: "thomas@mutcu.org",
    phone: "+1 (555) 345-6789",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    name: "Sarah Davis",
    role: "Children's Ministry Director",
    email: "sarah@mutcu.org",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "5",
    name: "Daniel Lee",
    role: "Outreach Coordinator",
    email: "daniel@mutcu.org",
    phone: "+1 (555) 567-8901",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: "1",
    title: "New Event Added",
    message: 'A new event "Prayer Meeting" has been added to the calendar.',
    createdAt: "2023-03-20T09:15:00",
    sentTo: "all",
    status: "sent",
  },
  {
    id: "2",
    title: "Document Update",
    message: 'The "Semester Calendar" document has been updated.',
    createdAt: "2023-03-19T14:30:00",
    sentTo: "admins",
    status: "sent",
  },
  {
    id: "3",
    title: "Feedback Reminder",
    message: "Please remind members to submit feedback for the Sunday service.",
    createdAt: "2023-03-18T10:45:00",
    sentTo: "event_managers",
    status: "pending",
  },
  {
    id: "4",
    title: "System Maintenance",
    message: "The system will be down for maintenance on Saturday from 2 AM to 4 AM.",
    createdAt: "2023-03-17T16:20:00",
    sentTo: "all",
    status: "sent",
  },
  {
    id: "5",
    title: "New User Registration",
    message: "A new user has registered and is pending approval.",
    createdAt: "2023-03-16T11:10:00",
    sentTo: "super_admin",
    status: "failed",
  },
]

// Stats for the dashboard
export const stats = {
  totalUsers: users.length,
  activeUsers: users.filter((user) => user.status === "active").length,
  totalEvents: events.length,
  upcomingEvents: events.filter((event) => new Date(event.date) > new Date()).length,
  totalDocuments: documents.length,
  totalFeedbacks: feedbacks.length,
  totalMinistryMembers: ministryMembers.length,
}

// Helper functions to simulate database operations

// Users
export async function getUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(users), 500)
  })
}

export async function getUserById(id: string): Promise<User | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(users.find((user) => user.id === id)), 500)
  })
}

export async function updateUser(updatedUser: User): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = users.findIndex((user) => user.id === updatedUser.id)
      if (index !== -1) {
        users[index] = updatedUser
      }
      resolve(updatedUser)
    }, 500)
  })
}

// Events
export async function getEvents(): Promise<Event[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(events), 500)
  })
}

export async function getEventById(id: string): Promise<Event | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(events.find((event) => event.id === id)), 500)
  })
}

export async function createEvent(newEvent: Omit<Event, "id">): Promise<Event> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = {
        id: (events.length + 1).toString(),
        ...newEvent,
      }
      events.push(event)
      resolve(event)
    }, 500)
  })
}

export async function updateEvent(updatedEvent: Event): Promise<Event> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = events.findIndex((event) => event.id === updatedEvent.id)
      if (index !== -1) {
        events[index] = updatedEvent
      }
      resolve(updatedEvent)
    }, 500)
  })
}

export async function deleteEvent(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = events.findIndex((event) => event.id === id)
      if (index !== -1) {
        events.splice(index, 1)
        resolve(true)
      } else {
        resolve(false)
      }
    }, 500)
  })
}

// Documents
export async function getDocuments(): Promise<Document[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(documents), 500)
  })
}

export async function getDocumentById(id: string): Promise<Document | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(documents.find((doc) => doc.id === id)), 500)
  })
}

export async function createDocument(newDocument: Omit<Document, "id">): Promise<Document> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const document = {
        id: (documents.length + 1).toString(),
        ...newDocument,
      }
      documents.push(document)
      resolve(document)
    }, 500)
  })
}

export async function deleteDocument(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = documents.findIndex((doc) => doc.id === id)
      if (index !== -1) {
        documents.splice(index, 1)
        resolve(true)
      } else {
        resolve(false)
      }
    }, 500)
  })
}

// Feedbacks
export async function getFeedbacks(): Promise<Feedback[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(feedbacks), 500)
  })
}

export async function getFeedbackForms(): Promise<FeedbackForm[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(feedbackForms), 500)
  })
}

export async function createFeedbackForm(newForm: Omit<FeedbackForm, "id">): Promise<FeedbackForm> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const form = {
        id: (feedbackForms.length + 1).toString(),
        ...newForm,
      }
      feedbackForms.push(form)
      resolve(form)
    }, 500)
  })
}

export async function updateFeedbackForm(updatedForm: FeedbackForm): Promise<FeedbackForm> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = feedbackForms.findIndex((form) => form.id === updatedForm.id)
      if (index !== -1) {
        feedbackForms[index] = updatedForm
      }
      resolve(updatedForm)
    }, 500)
  })
}

export async function deleteFeedbackForm(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = feedbackForms.findIndex((form) => form.id === id)
      if (index !== -1) {
        feedbackForms.splice(index, 1)
        resolve(true)
      } else {
        resolve(false)
      }
    }, 500)
  })
}

// Ministry Members
export async function getMinistryMembers(): Promise<MinistryMember[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(ministryMembers), 500)
  })
}

export async function getMinistryMemberById(id: string): Promise<MinistryMember | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(ministryMembers.find((member) => member.id === id)), 500)
  })
}

export async function createMinistryMember(newMember: Omit<MinistryMember, "id">): Promise<MinistryMember> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const member = {
        id: (ministryMembers.length + 1).toString(),
        ...newMember,
      }
      ministryMembers.push(member)
      resolve(member)
    }, 500)
  })
}

export async function updateMinistryMember(updatedMember: MinistryMember): Promise<MinistryMember> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = ministryMembers.findIndex((member) => member.id === updatedMember.id)
      if (index !== -1) {
        ministryMembers[index] = updatedMember
      }
      resolve(updatedMember)
    }, 500)
  })
}

export async function deleteMinistryMember(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = ministryMembers.findIndex((member) => member.id === id)
      if (index !== -1) {
        ministryMembers.splice(index, 1)
        resolve(true)
      } else {
        resolve(false)
      }
    }, 500)
  })
}

// Stats
export async function getStats(): Promise<typeof stats> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(stats), 500)
  })
}

