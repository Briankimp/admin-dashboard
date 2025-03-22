"use client"

import { useState, useEffect } from "react"
import { getDocuments, createDocument, deleteDocument, type Document } from "@/lib/data"
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
import { Badge } from "@/components/ui/badge"
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
import { FileText, MoreVertical, Plus, Trash2, Eye } from "lucide-react"

export default function ContentPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "",
    size: "",
    url: "#",
  })

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getDocuments()
        setDocuments(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching documents:", error)
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleAddDocument = async () => {
    if (!file) return

    try {
      // In a real application, you would upload the file to a storage service
      // and get a URL back. For this demo, we'll simulate that.
      const uploadedDocument = {
        ...newDocument,
        name: newDocument.name || file.name,
        type: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        size: formatFileSize(file.size),
        uploadedBy: "John Doe",
        uploadedAt: new Date().toISOString(),
      }

      const document = await createDocument(uploadedDocument)
      setDocuments([...documents, document])
      setIsAddDialogOpen(false)
      resetNewDocumentForm()
    } catch (error) {
      console.error("Error adding document:", error)
    }
  }

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return

    try {
      await deleteDocument(selectedDocument.id)
      setDocuments(documents.filter((d) => d.id !== selectedDocument.id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const resetNewDocumentForm = () => {
    setNewDocument({
      name: "",
      type: "",
      size: "",
      url: "#",
    })
    setFile(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getFileIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "PDF":
        return "📄"
      case "DOCX":
      case "DOC":
        return "📝"
      case "XLSX":
      case "XLS":
        return "📊"
      case "PPTX":
      case "PPT":
        return "📑"
      default:
        return "📁"
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading documents...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Upload and manage important documents</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length > 0 ? (
              documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getFileIcon(document.type)}</span>
                      <span className="font-medium">{document.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.type}</Badge>
                  </TableCell>
                  <TableCell>{document.size}</TableCell>
                  <TableCell>{document.uploadedBy}</TableCell>
                  <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                  <TableCell>
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
                            setSelectedDocument(document)
                            setIsPreviewDialogOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDocument(document)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No documents found. Upload your first document!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a document to share with the MUTCU community</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0]
                  if (selectedFile) {
                    setFile(selectedFile)
                    setNewDocument({
                      ...newDocument,
                      name: selectedFile.name,
                    })
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Document Name (Optional)</Label>
              <Input
                id="name"
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                placeholder="Enter a custom name for the document"
              />
              <p className="text-xs text-muted-foreground">Leave blank to use the original file name</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDocument} disabled={!file}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Document Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Document Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedDocument && selectedDocument.name}</DialogTitle>
            <DialogDescription>
              {selectedDocument &&
                `Uploaded by ${selectedDocument.uploadedBy} on ${formatDate(selectedDocument.uploadedAt)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex h-[400px] items-center justify-center rounded-md border bg-muted p-4">
            <div className="text-center">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
              <p className="mt-2 text-lg font-medium">{selectedDocument && selectedDocument.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedDocument && selectedDocument.type} · {selectedDocument && selectedDocument.size}
              </p>
              <Button className="mt-4" asChild>
                <a href={selectedDocument?.url} target="_blank" rel="noopener noreferrer">
                  Download
                </a>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

