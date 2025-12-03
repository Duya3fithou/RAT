"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { X, Loader2, Plus, Trash2 } from "lucide-react"
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
import { createFeature, type SubFeature } from "@/lib/api/features"
import { useProject } from "@/lib/project-context"
import { useToast } from "@/hooks/use-toast"

interface FeatureWithRelation extends SubFeature {
  relatedFeature?: string
  relationDescription?: string
}

export default function AddNewFeaturePage() {
  const router = useRouter()
  const params = useParams()
  const { projects, selectedProject, setSelectedProject, refreshProjects } = useProject()
  const { toast } = useToast()

  const appId = Number(params.appId)
  const projectId = Number(params.projectId)

  // Auto-select project if not already selected và reset form khi đổi project
  useEffect(() => {
    if (projectId && projects.length > 0) {
      if (!selectedProject || selectedProject.id !== projectId) {
        const project = projects.find((p) => p.id === projectId)
        if (project) {
          console.log("[AddNewFeature] Auto-selecting project:", project.id)
          setSelectedProject(project)
          // Reset form khi chuyển project
          setTitle("")
          setDescription("")
          setFeatures([{ name: "", description: "", relatedFeature: "", relationDescription: "" }])
        }
      }
    }
  }, [projectId, projects, selectedProject, setSelectedProject])

  const app = selectedProject?.apps.find((a) => a.id === appId)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [features, setFeatures] = useState<FeatureWithRelation[]>([
    { name: "", description: "", relatedFeature: "", relationDescription: "" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addFeature = () => {
    setFeatures([
      ...features,
      { name: "", description: "", relatedFeature: "", relationDescription: "" },
    ])
  }

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index))
    }
  }

  const updateFeature = (
    index: number,
    field: keyof FeatureWithRelation,
    value: string
  ) => {
    const newFeatures = [...features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setFeatures(newFeatures)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề",
        variant: "destructive",
      })
      return
    }

    if (!description.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mô tả",
        variant: "destructive",
      })
      return
    }

    // Validate at least one feature
    const validFeatures = features.filter(
      (f) => f.name.trim() && f.description.trim()
    )

    if (validFeatures.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng thêm ít nhất một function",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare features data (exclude relation fields)
      const featuresToSubmit: SubFeature[] = validFeatures.map((f) => ({
        name: f.name.trim(),
        description: f.description.trim(),
      }))

      const result = await createFeature(appId, {
        name: title.trim(),
        description: description.trim(),
        attachments: [],
        features: featuresToSubmit,
      })

      console.log("Feature created successfully:", result)

      // Refresh projects to get updated data
      await refreshProjects()

      toast({
        title: "Thành công",
        description: `Feature "${result.name}" đã được tạo thành công`,
      })

      // Navigate back to app detail page
      router.push(`/projects/${projectId}/apps/${appId}`)
    } catch (error) {
      console.error("Failed to create feature:", error)
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể tạo feature",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get all existing features from current app for the related feature dropdown
  const existingFeatures = selectedProject?.apps
    .find((a) => a.id === appId)
    ?.id
    ? [
        "HQ",
        "CMS",
        "Franchise Portal",
        "Function 1",
        "Function 2",
        "Function 3",
      ]
    : []

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex justify-center items-start">
      <Card className="w-full max-w-4xl rounded-3xl shadow-lg border-muted/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-end gap-4 p-6 border-b border-border/50 bg-muted/10">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl text-muted-foreground hover:text-destructive"
            disabled={isSubmitting}
          >
            Delete
          </Button>
          <Link href={`/projects/${projectId}/apps/${appId}`}>
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
            {/* Title Section */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-lg font-bold">
                Title: {app?.name}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề..."
                className="text-lg font-medium rounded-xl border-muted-foreground/20 h-12"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-lg font-bold">
                Description:
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[150px] rounded-2xl border-muted-foreground/20 resize-none p-4 text-base"
                placeholder="Enter project description..."
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Functions Section */}
            {features.map((feature, index) => (
              <div
                key={index}
                className="space-y-4 p-6 rounded-3xl bg-muted/30 border border-border/50 relative"
              >
                {/* Remove button */}
                {features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFeature(index)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                {/* Function name/description */}
                <div className="space-y-3">
                  <Label
                    htmlFor={`func-${index}`}
                    className="text-base font-semibold"
                  >
                    {index + 1}. Function {index + 1}:
                  </Label>
                  <Input
                    id={`func-${index}`}
                    value={feature.name}
                    onChange={(e) => updateFeature(index, "name", e.target.value)}
                    placeholder="Tên function"
                    className="rounded-xl border-muted-foreground/20 bg-background"
                    disabled={isSubmitting}
                  />
                  <Textarea
                    value={feature.description}
                    onChange={(e) =>
                      updateFeature(index, "description", e.target.value)
                    }
                    placeholder="Mô tả function"
                    className="min-h-[100px] rounded-xl border-muted-foreground/20 bg-background resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Related function (optional) */}
                <div className="space-y-3 pl-4 border-l-2 border-indigo-500/20">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Related function (optional)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      value={feature.relatedFeature}
                      onValueChange={(value) =>
                        updateFeature(index, "relatedFeature", value)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="rounded-xl bg-background border-muted-foreground/20">
                        <SelectValue placeholder="Select a function" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {existingFeatures.map((feat) => (
                          <SelectItem key={feat} value={feat}>
                            {feat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={feature.relationDescription}
                      onChange={(e) =>
                        updateFeature(index, "relationDescription", e.target.value)
                      }
                      placeholder="Describe relation"
                      className="rounded-xl border-muted-foreground/20 bg-background"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Function Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-2xl border-dashed"
              onClick={addFeature}
              disabled={isSubmitting}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Function
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

