"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { RatLayout } from "@/components/rat/layout"
import { useProject } from "@/lib/project-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Globe, Smartphone, Monitor, Calendar, Edit, Loader2, ChevronDown, AlertCircle, Trash2, Plus, X, Link as LinkIcon, FileUp, Download } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { getAppDetail, getRelatedFeaturesTree, type AppDetail, type RelatedAppFeatures, type Feature } from "@/lib/api/apps"
import { createFeature } from "@/lib/api/features"
import { toast } from "sonner"
import axios from "axios"
import { EditFeatureDialog } from "@/components/features/edit-feature-dialog"
import { AddFeatureDialog } from "@/components/features/add-feature-dialog"

function AppDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { projects, selectedProject, setSelectedProject, refreshProjects } = useProject()
  const projectId = Number(params.projectId)
  const appId = Number(params.appId)

  // State quản lý app detail từ API
  const [appDetail, setAppDetail] = useState<AppDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State quản lý related features
  const [relatedFeatures, setRelatedFeatures] = useState<RelatedAppFeatures[]>([])
  const [isLoadingRelated, setIsLoadingRelated] = useState(false)
  
  // State quản lý delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // State quản lý edit app dialog
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editName, setEditName] = useState("")
  const [editType, setEditType] = useState("")

  // State quản lý edit feature dialog
  const [showEditFeatureDialog, setShowEditFeatureDialog] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [isUpdatingFeature, setIsUpdatingFeature] = useState(false)

  // State quản lý add feature dialog
  const [showAddFeatureDialog, setShowAddFeatureDialog] = useState(false)
  const [isCreatingFeature, setIsCreatingFeature] = useState(false)
  
  // State quản lý delete feature dialog  
  const [showDeleteFeatureDialog, setShowDeleteFeatureDialog] = useState(false)
  const [deletingFeature, setDeletingFeature] = useState<Feature | null>(null)
  const [isDeletingFeature, setIsDeletingFeature] = useState(false)

  // State quản lý download testcases
  const [isDownloadingTestcases, setIsDownloadingTestcases] = useState(false)

  // Auto-select project if not already selected
  useEffect(() => {
    if (projectId && projects.length > 0) {
      if (!selectedProject || selectedProject.id !== projectId) {
        const project = projects.find((p) => p.id === projectId)
        if (project) {
          console.log("[AppDetail] Auto-selecting project:", project.id)
          setSelectedProject(project)
        }
      }
    }
  }, [projectId, projects, selectedProject, setSelectedProject])

  // Load app detail từ API khi appId thay đổi
  useEffect(() => {
    const loadAppDetail = async () => {
      if (!projectId || !appId) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await getAppDetail(projectId, appId)
        setAppDetail(data)
      } catch (err: any) {
        console.error("Error loading app detail:", err)
        const errorMessage = err.message || "Failed to load app detail"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadAppDetail()
  }, [projectId, appId])

  // Load related features tree
  useEffect(() => {
    const loadRelatedFeatures = async () => {
      if (!appId) return

      try {
        setIsLoadingRelated(true)
        const data = await getRelatedFeaturesTree(appId)
        setRelatedFeatures(data)
      } catch (err: any) {
        console.error("Error loading related features:", err)
        // Don't show error toast for related features, just log it
      } finally {
        setIsLoadingRelated(false)
      }
    }

    loadRelatedFeatures()
  }, [appId])

  const app = appDetail

  const getAppIcon = (type: string) => {
    switch (type) {
      case "USER_WEB":
        return <Globe className="h-6 w-6" />
      case "USER_APP":
        return <Smartphone className="h-6 w-6" />
      case "STAFF_WEB":
        return <Monitor className="h-6 w-6" />
      default:
        return <Globe className="h-6 w-6" />
    }
  }

  const getAppTypeBadge = (type: string) => {
    switch (type) {
      case "USER_WEB":
        return <Badge variant="secondary">User Web</Badge>
      case "USER_APP":
        return <Badge variant="secondary">User App</Badge>
      case "STAFF_WEB":
        return <Badge variant="outline">Staff Web</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading app details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "App not found"}</AlertDescription>
        </Alert>
        <Link href="/">
          <Button variant="outline" className="rounded-xl bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  // Lọc ra các parent features (không có parent_feature_id)
  const parentFeatures = app.features?.filter((f) => f.parent_feature_id === null) || []
  
  // Sắp xếp features theo order_index
  const sortedParentFeatures = [...parentFeatures].sort((a, b) => a.order_index - b.order_index)

  // Handle open edit dialog
  const handleOpenEditDialog = () => {
    if (app) {
      setEditName(app.name)
      setEditType(app.type)
      setShowEditDialog(true)
    }
  }

  // Handle update app
  const handleUpdateApp = async () => {
    if (!editName.trim()) {
      toast.error("App name is required")
      return
    }

    if (!editType) {
      toast.error("App type is required")
      return
    }

    try {
      setIsUpdating(true)

      await axios.put(`/api/apps/${appId}`, {
        name: editName.trim(),
        type: editType,
      })

      toast.success("App updated successfully!")

      // Refresh projects để cập nhật sidebar
      await refreshProjects()

      // Reload app detail
      const updatedData = await getAppDetail(projectId, appId)
      setAppDetail(updatedData)

      setShowEditDialog(false)
    } catch (err: any) {
      console.error("Error updating app:", err)
      const errorMessage = err.response?.data?.error || err.message || "Failed to update app"
      toast.error(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle add feature
  const handleAddFeature = () => {
    setShowAddFeatureDialog(true)
  }

  // Handle create feature
  const handleCreateFeature = async (formData: any) => {
    try {
      setIsCreatingFeature(true)

      await createFeature(appId, formData)

      toast.success("Feature created successfully!")

      // Reload app detail
      const updatedData = await getAppDetail(projectId, appId)
      setAppDetail(updatedData)

      // Refresh projects để cập nhật sidebar
      await refreshProjects()

      // Reload related features
      const relatedData = await getRelatedFeaturesTree(appId)
      setRelatedFeatures(relatedData)

      setShowAddFeatureDialog(false)
    } catch (err: any) {
      console.error("Error creating feature:", err)
      const errorMessage = err.response?.data?.error || err.message || "Failed to create feature"
      toast.error(errorMessage)
      throw err
    } finally {
      setIsCreatingFeature(false)
    }
  }

  // Handle edit feature
  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature)
    setShowEditFeatureDialog(true)
  }

  // Handle save feature
  const handleSaveFeature = async (formData: any) => {
    if (!editingFeature) return

    try {
      setIsUpdatingFeature(true)

      await axios.patch(`/api/apps/${appId}/features/${editingFeature.id}`, formData)

      toast.success("Feature updated successfully!")

      // Reload app detail
      const updatedData = await getAppDetail(projectId, appId)
      setAppDetail(updatedData)

      // Refresh projects để cập nhật sidebar
      await refreshProjects()

      // Reload related features
      const relatedData = await getRelatedFeaturesTree(appId)
      setRelatedFeatures(relatedData)

      setShowEditFeatureDialog(false)
      setEditingFeature(null)
    } catch (err: any) {
      console.error("Error updating feature:", err)
      const errorMessage = err.response?.data?.error || err.message || "Failed to update feature"
      toast.error(errorMessage)
      throw err
    } finally {
      setIsUpdatingFeature(false)
    }
  }

  // Handle delete feature - open confirmation
  const handleDeleteFeatureClick = (feature: Feature) => {
    setDeletingFeature(feature)
    setShowDeleteFeatureDialog(true)
  }

  // Handle delete feature - confirm
  const handleDeleteFeature = async () => {
    if (!deletingFeature) return

    try {
      setIsDeletingFeature(true)

      await axios.delete(`/api/apps/${appId}/features/${deletingFeature.id}`)

      toast.success("Feature deleted successfully!")

      // Reload app detail
      const updatedData = await getAppDetail(projectId, appId)
      setAppDetail(updatedData)

      // Refresh projects để cập nhật sidebar
      await refreshProjects()

      setShowDeleteFeatureDialog(false)
      setDeletingFeature(null)
    } catch (err: any) {
      console.error("Error deleting feature:", err)
      const errorMessage = err.response?.data?.error || err.message || "Failed to delete feature"
      toast.error(errorMessage)
    } finally {
      setIsDeletingFeature(false)
    }
  }

  // Handle delete app
  const handleDeleteApp = async () => {
    try {
      setIsDeleting(true)
      
      await axios.delete(`/api/apps/${appId}`)
      
      toast.success("App deleted successfully!")
      
      // Refresh projects để cập nhật list
      await refreshProjects()
      
      // Navigate về home
      router.push("/")
    } catch (err: any) {
      console.error("Error deleting app:", err)
      const errorMessage = err.response?.data?.error || err.message || "Failed to delete app"
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  // Handle download testcases for app
  const handleDownloadTestcases = async () => {
    try {
      setIsDownloadingTestcases(true)
      setError(null)

      const apiUrl = `/api/projects/${projectId}/requirement-analyze/test-cases/${appId}`
      console.log("[Download] Fetching test cases from:", apiUrl)

      const response = await axios.get(apiUrl, {
        responseType: "blob",
      })

      // Tạo blob URL và trigger download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Tạo tên file với timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      link.download = `testcases_app_${appId}_${timestamp}.xlsx`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Test cases downloaded successfully!")
    } catch (err: any) {
      console.error("Error downloading test cases:", err)
      const errorMessage = err.response?.data?.error || err.message || "Failed to download test cases"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsDownloadingTestcases(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">{getAppIcon(app.type)}</div>
            <div>
              <h1 className="text-2xl font-bold">{app.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {getAppTypeBadge(app.type)}
                {selectedProject && <span className="text-sm text-muted-foreground">{selectedProject.name}</span>}
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>Created: {new Date(app.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>Last Updated: {new Date(app.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
          <div className="flex gap-2">
          <Button 
            onClick={handleAddFeature}
            className="rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            Add Feature
          </Button>
          <Button
            variant="outline"
            className="rounded-xl bg-transparent"
            onClick={handleDownloadTestcases}
            disabled={isDownloadingTestcases}
          >
            {isDownloadingTestcases ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Testcase
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            className="rounded-xl bg-transparent"
            onClick={handleOpenEditDialog}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            className="rounded-xl bg-transparent text-destructive hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Edit App Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit App</DialogTitle>
            <DialogDescription>
              Update the app name and type. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter app name"
                className="rounded-lg"
                disabled={isUpdating}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={editType} onValueChange={setEditType} disabled={isUpdating}>
                <SelectTrigger id="edit-type" className="rounded-lg">
                  <SelectValue placeholder="Select app type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER_WEB">User Web</SelectItem>
                  <SelectItem value="STAFF_WEB">Staff Web</SelectItem>
                  <SelectItem value="USER_APP">User App</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isUpdating}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateApp}
              disabled={isUpdating}
              className="rounded-lg"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete App Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this app?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the app "{app.name}" and all its features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteApp}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Feature Dialog */}
      <AddFeatureDialog
        open={showAddFeatureDialog}
        onOpenChange={setShowAddFeatureDialog}
        appId={appId}
        onSave={handleCreateFeature}
        isLoading={isCreatingFeature}
      />

      {/* Edit Feature Dialog */}
      {editingFeature && (
        <EditFeatureDialog
          open={showEditFeatureDialog}
          onOpenChange={setShowEditFeatureDialog}
          feature={editingFeature}
          appId={appId}
          onSave={handleSaveFeature}
          isLoading={isUpdatingFeature}
        />
      )}

      {/* Delete Feature Confirmation Dialog */}
      <AlertDialog open={showDeleteFeatureDialog} onOpenChange={setShowDeleteFeatureDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this feature?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the feature "{deletingFeature?.name}" and all its sub-features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingFeature}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFeature}
              disabled={isDeletingFeature}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingFeature ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Description - chỉ hiển thị khi có description */}
      {app.description && app.description.trim() !== "" && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{app.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Features Section */}
      {sortedParentFeatures.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              {sortedParentFeatures.length} main feature{sortedParentFeatures.length > 1 ? "s" : ""} with sub-features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {sortedParentFeatures.map((feature) => {
                // Sắp xếp children theo order_index
                const sortedChildren = feature.children
                  ? [...feature.children].sort((a, b) => a.order_index - b.order_index)
                  : []

                return (
                  <AccordionItem key={feature.id} value={`feature-${feature.id}`} className="border-b last:border-0">
                    <div className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        {sortedChildren.length > 0 ? (
                          <AccordionTrigger className="hover:no-underline flex-1 [&[data-state=open]>div>svg]:rotate-180">
                            <div className="flex items-start gap-3 text-left flex-1">
                              <Badge variant="outline" className="mt-0.5 font-mono text-xs">
                                {feature.order_index}
                              </Badge>
                              <div className="flex-1">
                                <h4 className="font-semibold text-base">{feature.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {sortedChildren.length} sub-feature{sortedChildren.length > 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                        ) : (
                          <div className="flex items-start gap-3 text-left flex-1">
                            <Badge variant="outline" className="mt-0.5 font-mono text-xs">
                              {feature.order_index}
                            </Badge>
                            <div className="flex-1">
                              <h4 className="font-semibold text-base">{feature.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditFeature(feature)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFeatureClick(feature)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {sortedChildren.length > 0 && (
                      <AccordionContent className="pb-4">
                        <div className="pl-12 space-y-3">
                          {sortedChildren.map((child) => (
                            <div
                              key={child.id}
                              className="p-4 rounded-xl bg-muted/50 border border-border/50"
                            >
                              <div className="flex items-start gap-3">
                                <Badge variant="secondary" className="mt-0.5 font-mono text-xs">
                                  {feature.order_index}.{child.order_index}
                                </Badge>
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm">{child.name}</h5>
                                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                                    {child.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    )}
                  </AccordionItem>
                )
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Related Features Section */}
      {relatedFeatures.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Related Features</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Features from other apps in this project
            </p>
          </div>

          <div className="relative overflow-x-auto pb-2">
            <div className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] grid-rows-2 gap-4">
              {relatedFeatures.flatMap((appFeatures) =>
                appFeatures.features.map((feature) => (
                  <Card key={`${appFeatures.app_id}-${feature.id}`} className="rounded-2xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-1">{feature.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {appFeatures.app_name}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {feature.children.length > 0 ? (
                        <div className="space-y-2 max-h-[120px] overflow-y-auto">
                          {feature.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/projects/${projectId}/apps/${appFeatures.app_id}`}
                              className="block"
                            >
                              <div className="px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                                <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                                  {child.name}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No sub-features</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AppDetailPage() {
  return (
    <RatLayout>
      <AppDetailContent />
    </RatLayout>
  )
}
