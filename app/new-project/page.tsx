"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProject } from "@/lib/api/projects"
import { useProject } from "@/lib/project-context"
import { useToast } from "@/hooks/use-toast"

export default function NewProjectPage() {
  const router = useRouter()
  const { refreshProjects } = useProject()
  const { toast } = useToast()
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên dự án",
        variant: "destructive",
      })
      return
    }
    
    if (!description.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mô tả dự án",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      // Create project
      const result = await createProject({
        name: name.trim(),
        description: description.trim(),
      })
      
      console.log("Project created successfully:", result)
      
      // Refresh projects list
      await refreshProjects()
      
      toast({
        title: "Thành công",
        description: `Dự án "${result.name}" đã được tạo thành công`,
      })
      
      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Failed to create project:", error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tạo dự án",
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
          <h1 className="text-2xl font-bold">Tạo dự án mới</h1>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                <X className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 md:p-10 space-y-8">
            {/* Name Section */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-lg font-bold">
                Tên dự án <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên dự án..."
                className="text-lg font-medium rounded-xl border-muted-foreground/20 h-12"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-lg font-bold">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] rounded-2xl border-muted-foreground/20 resize-none p-4 text-base"
                placeholder="Nhập mô tả dự án..."
                disabled={isSubmitting}
                required
              />
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
                  "Tạo dự án"
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
