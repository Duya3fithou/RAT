"use client"

import { useParams } from "next/navigation"
import { RatLayout } from "@/components/rat/layout"
import { useProject } from "@/lib/project-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Globe, Smartphone, Monitor, Calendar, Edit } from "lucide-react"
import Link from "next/link"

function AppDetailContent() {
  const params = useParams()
  const { selectedProject } = useProject()
  const appId = Number(params.appId)

  const app = selectedProject?.apps.find((a) => a.id === appId)

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

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-muted-foreground">App not found. Please select a project first.</p>
        <Link href="/">
          <Button variant="outline" className="rounded-xl bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            </div>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl bg-transparent">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{app.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Created At</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(app.created_at).toLocaleDateString()}</span>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(app.updated_at).toLocaleDateString()}</span>
          </CardContent>
        </Card>
      </div>
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
