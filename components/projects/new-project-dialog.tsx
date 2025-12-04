"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface ProjectFormData {
  name: string
  description: string
}

interface NewProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: ProjectFormData) => Promise<void>
  isLoading: boolean
}

export function NewProjectDialog({ open, onOpenChange, onSave, isLoading }: NewProjectDialogProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
  })

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      // Reset form when closing
      setFormData({
        name: "",
        description: "",
      })
    }
    onOpenChange(newOpen)
  }

  const handleSubmit = async () => {
    await onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter the project details below. Click create when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name..."
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description..."
              className="min-h-[150px]"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

