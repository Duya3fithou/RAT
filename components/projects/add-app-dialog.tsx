"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

interface AddAppDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: { name: string; type: string; description: string }) => Promise<void>
  isLoading: boolean
}

export function AddAppDialog({ open, onOpenChange, onSave, isLoading }: AddAppDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  })

  // Reset form when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      // Reset form when closing
      setFormData({
        name: "",
        type: "",
        description: "",
      })
    }
    onOpenChange(newOpen)
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      return
    }
    if (!formData.type) {
      return
    }
    if (!formData.description.trim()) {
      return
    }

    await onSave(formData)
  }

  const isFormValid = formData.name.trim() && formData.type && formData.description.trim()

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col gap-0">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add New App</DialogTitle>
          <DialogDescription>
            Create a new application for your project.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 py-4 pr-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="app-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="app-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter app name"
              disabled={isLoading}
              required
            />
          </div>

          {/* Type */}
          <div className="grid gap-2">
            <Label htmlFor="app-type">
              Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              disabled={isLoading}
              required
            >
              <SelectTrigger id="app-type">
                <SelectValue placeholder="Select app type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER_WEB">User Web</SelectItem>
                <SelectItem value="USER_APP">User App</SelectItem>
                <SelectItem value="STAFF_WEB">Staff Web</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="app-description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="app-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter app description"
              className="min-h-[100px]"
              disabled={isLoading}
              required
            />
          </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create App"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

