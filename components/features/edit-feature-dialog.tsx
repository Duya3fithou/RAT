"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, X, Link as LinkIcon, FileUp, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Attachment {
  type: "link" | "file"
  source: string
}

interface RelatedFeature {
  feature_id?: number
  description: string
}

interface SubFeature {
  name: string
  description: string
  attachments?: Attachment[]
  related_features?: RelatedFeature[]
}

interface FeatureFormData {
  name: string
  description: string
  attachments: Attachment[]
  features: SubFeature[]
}

interface EditFeatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: any
  appId: number
  onSave: (data: FeatureFormData) => Promise<void>
  isLoading: boolean
}

export function EditFeatureDialog({ open, onOpenChange, feature, appId, onSave, isLoading }: EditFeatureDialogProps) {
  const [formData, setFormData] = useState<FeatureFormData>({
    name: "",
    description: "",
    attachments: [],
    features: [],
  })

  // Initialize form data when feature changes
  useEffect(() => {
    if (feature) {
      setFormData({
        name: feature.name || "",
        description: feature.description || "",
        attachments: feature.attachments || [],
        features: feature.children?.map((child: any) => ({
          name: child.name || "",
          description: child.description || "",
          attachments: child.attachments || [],
          related_features: child.related_features || [],
        })) || [],
      })
    }
  }, [feature])

  const handleSubmit = async () => {
    await onSave(formData)
  }

  // Attachments handlers
  const addAttachment = (type: "link" | "file") => {
    setFormData({
      ...formData,
      attachments: [...formData.attachments, { type, source: "" }],
    })
  }

  const updateAttachment = (index: number, source: string) => {
    const newAttachments = [...formData.attachments]
    newAttachments[index].source = source
    setFormData({ ...formData, attachments: newAttachments })
  }

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index),
    })
  }

  // Sub-features handlers
  const addSubFeature = () => {
    setFormData({
      ...formData,
      features: [
        ...formData.features,
        { name: "", description: "", attachments: [], related_features: [] },
      ],
    })
  }

  const updateSubFeature = (index: number, field: keyof SubFeature, value: any) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setFormData({ ...formData, features: newFeatures })
  }

  const removeSubFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  // Sub-feature attachments handlers
  const addSubFeatureAttachment = (featureIndex: number, type: "link" | "file") => {
    const newFeatures = [...formData.features]
    if (!newFeatures[featureIndex].attachments) {
      newFeatures[featureIndex].attachments = []
    }
    newFeatures[featureIndex].attachments!.push({ type, source: "" })
    setFormData({ ...formData, features: newFeatures })
  }

  const updateSubFeatureAttachment = (featureIndex: number, attachmentIndex: number, source: string) => {
    const newFeatures = [...formData.features]
    if (newFeatures[featureIndex].attachments) {
      newFeatures[featureIndex].attachments![attachmentIndex].source = source
    }
    setFormData({ ...formData, features: newFeatures })
  }

  const removeSubFeatureAttachment = (featureIndex: number, attachmentIndex: number) => {
    const newFeatures = [...formData.features]
    if (newFeatures[featureIndex].attachments) {
      newFeatures[featureIndex].attachments = newFeatures[featureIndex].attachments!.filter(
        (_, i) => i !== attachmentIndex
      )
    }
    setFormData({ ...formData, features: newFeatures })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden flex flex-col gap-0">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Feature</DialogTitle>
          <DialogDescription>
            Update the feature details, attachments, and sub-features.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4 pr-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Feature name"
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Feature description"
                  className="min-h-[80px]"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Attachments</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAttachment("link")}
                    disabled={isLoading}
                  >
                    <LinkIcon className="h-3 w-3 mr-1" />
                    Add Link
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAttachment("file")}
                    disabled={isLoading}
                  >
                    <FileUp className="h-3 w-3 mr-1" />
                    Add File
                  </Button>
                </div>
              </div>

              {formData.attachments.map((attachment, index) => (
                <div key={index} className="flex gap-2">
                  <Badge variant="secondary" className="h-10 px-3 flex items-center">
                    {attachment.type === "link" ? <LinkIcon className="h-3 w-3" /> : <FileUp className="h-3 w-3" />}
                  </Badge>
                  <Input
                    value={attachment.source}
                    onChange={(e) => updateAttachment(index, e.target.value)}
                    placeholder={attachment.type === "link" ? "https://..." : "File URL"}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAttachment(index)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Sub Features */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Sub-Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubFeature}
                  disabled={isLoading}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Sub-Feature
                </Button>
              </div>

              {formData.features.map((subFeature, featureIndex) => (
                <Card key={featureIndex}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Sub-Feature {featureIndex + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => removeSubFeature(featureIndex)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      value={subFeature.name}
                      onChange={(e) => updateSubFeature(featureIndex, "name", e.target.value)}
                      placeholder="Sub-feature name"
                      disabled={isLoading}
                    />
                    <Textarea
                      value={subFeature.description}
                      onChange={(e) => updateSubFeature(featureIndex, "description", e.target.value)}
                      placeholder="Sub-feature description"
                      className="min-h-[60px]"
                      disabled={isLoading}
                    />

                    {/* Sub-feature Attachments */}
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSubFeatureAttachment(featureIndex, "link")}
                          disabled={isLoading}
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          Link
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSubFeatureAttachment(featureIndex, "file")}
                          disabled={isLoading}
                        >
                          <FileUp className="h-3 w-3 mr-1" />
                          File
                        </Button>
                      </div>

                      {subFeature.attachments?.map((attachment, attachmentIndex) => (
                        <div key={attachmentIndex} className="flex gap-2">
                          <Badge variant="outline" className="h-8 px-2 flex items-center">
                            {attachment.type === "link" ? (
                              <LinkIcon className="h-3 w-3" />
                            ) : (
                              <FileUp className="h-3 w-3" />
                            )}
                          </Badge>
                          <Input
                            value={attachment.source}
                            onChange={(e) =>
                              updateSubFeatureAttachment(featureIndex, attachmentIndex, e.target.value)
                            }
                            placeholder={attachment.type === "link" ? "https://..." : "File URL"}
                            className="text-sm"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeSubFeatureAttachment(featureIndex, attachmentIndex)}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
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
  )
}

