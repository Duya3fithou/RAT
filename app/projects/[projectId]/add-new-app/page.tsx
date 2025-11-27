"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProject } from "@/lib/project-context"
import { useToast } from "@/hooks/use-toast"

export default function AddNewAppPage() {
  const router = useRouter()
  const params = useParams()
  const { projects, selectedProject, setSelectedProject, refreshProjects } = useProject()
  const { toast } = useToast()

  const projectId = Number(params.projectId)

  const [name, setName] = useState("")
  const [type, setType] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-select project if not already selected
  useEffect(() => {
    if (projectId && projects.length > 0) {
      if (!selectedProject || selectedProject.id !== projectId) {
        const project = projects.find((p) => p.id === projectId)
        if (project) {
          console.log("[AddNewApp] Auto-selecting project:", project.id)
          setSelectedProject(project)
        }
      }
    }
  }, [projectId, projects, selectedProject, setSelectedProject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên app",
        variant: "destructive",
      })
      return
    }

    if (!type) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn loại app",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Call API to create app
      const response = await fetch(`/api/projects/${projectId}/apps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          type: type,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create app")
      }

      const result = await response.json()
      console.log("App created successfully:", result)

      // Refresh projects to get updated data
      await refreshProjects()

      toast({
        title: "Thành công",
        description: `App "${result.name}" đã được tạo thành công`,
      })

      // Navigate back to home or app detail
      router.push("/")
    } catch (error) {
      console.error("Failed to create app:", error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tạo app",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex justify-center items-start">
      <Card className="w-full max-w-4xl rounded-3xl shadow-lg border-muted/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-6 border-b border-border/50 bg-muted/10">
          <h1 className="text-2xl font-bold">
            Thêm App mới
            {selectedProject && (
              <span className="text-base font-normal text-muted-foreground ml-2">
                - {selectedProject.name}
              </span>
            )}
          </h1>
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 md:p-10 space-y-8">
            {/* Name Section */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-lg font-bold">
                Tên App <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: User Mobile App, Admin Web, CMS..."
                className="text-lg font-medium rounded-xl border-muted-foreground/20 h-12"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Type Section */}
            <div className="space-y-3">
              <Label htmlFor="type" className="text-lg font-bold">
                Loại App <span className="text-red-500">*</span>
              </Label>
              <Select value={type} onValueChange={setType} disabled={isSubmitting}>
                <SelectTrigger className="w-full rounded-xl border-muted-foreground/20 h-12">
                  <SelectValue placeholder="Chọn loại app" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="USER_WEB">User Web</SelectItem>
                  <SelectItem value="USER_APP">User App</SelectItem>
                  <SelectItem value="STAFF_WEB">Staff Web</SelectItem>
                  <SelectItem value="ADMIN_WEB">Admin Web</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Link href="/">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
              </Link>
              <Button
                type="submit"
                className="rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo App"
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

