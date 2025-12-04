"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { FileSearch, TestTube2, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProject } from "@/lib/project-context"

export function RatSidebar() {
  const { projects, selectedProject, setSelectedProject, isLoading, error } = useProject()
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const lastSelectedProjectId = useRef<number | null>(null)
  
  // Get current project ID and app ID from URL if available
  const urlProjectId = params?.projectId ? Number(params.projectId) : null
  const currentAppId = params?.appId ? Number(params.appId) : null

  // Auto-select project based on URL params
  useEffect(() => {
    if (urlProjectId && projects.length > 0 && !isLoading) {
      // Chỉ update khi project thực sự thay đổi
      if (lastSelectedProjectId.current !== urlProjectId) {
        const projectFromUrl = projects.find((p) => p.id === urlProjectId)
        if (projectFromUrl && (!selectedProject || selectedProject.id !== urlProjectId)) {
          console.log("[Sidebar] Auto-selecting project from URL:", projectFromUrl.id)
          setSelectedProject(projectFromUrl)
          lastSelectedProjectId.current = urlProjectId
        }
      }
    }
  }, [urlProjectId, projects, isLoading, selectedProject, setSelectedProject])

  const handleSelectProject = (projectId: string) => {
    const project = projects.find((p) => p.id.toString() === projectId)
    if (project) {
      setSelectedProject(project)
      
      // Nếu đang ở trong một trang project cụ thể, redirect sang project mới
      if (pathname && pathname.includes('/projects/')) {
        // Kiểm tra các trang con
        if (pathname.includes('/analyze')) {
          router.push(`/projects/${projectId}/analyze`)
        } else if (pathname.includes('/generate-testcase')) {
          router.push(`/projects/${projectId}/generate-testcase`)
        } else if (pathname.includes('/apps/')) {
          // Nếu đang ở trang app, chuyển về trang project hoặc app đầu tiên của project mới
          if (project.apps.length > 0) {
            router.push(`/projects/${projectId}/apps/${project.apps[0].id}`)
          } else {
            router.push(`/projects/${projectId}/add-new-app`)
          }
        } else if (pathname.includes('/add-new-app')) {
          router.push(`/projects/${projectId}/add-new-app`)
        }
      }
    } 
  }

  return (
    <aside className="w-72 min-h-[calc(100vh-2rem)] bg-muted/50 rounded-2xl m-4 mr-0 p-4 flex flex-col">
      {/* Projects Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-foreground">Projects</h2>
          <Link href="/new-project">
            <Button size="sm" className="rounded-lg h-8 px-3">
              Add new
            </Button>
          </Link>
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
        
        <Select
          value={selectedProject?.id.toString() || ""}
          onValueChange={handleSelectProject}
          disabled={isLoading || !!error}
        >
          <SelectTrigger className="w-full rounded-lg bg-background">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <SelectValue placeholder="Select a project" />
            )}
          </SelectTrigger>
          <SelectContent>
            {projects.length === 0 && !isLoading ? (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                No projects found
              </div>
            ) : (
              projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Tools & System Structure - Only show when project is selected */}
      {selectedProject && (
        <div className="mt-6 space-y-6 flex-1">
          {/* Tools Section */}
          <div className="space-y-2">
            <h3 className="font-bold text-foreground">Tools</h3>
            <nav className="space-y-1">
              <Link
                href={`/projects/${selectedProject.id}/analyze`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
              >
                <FileSearch className="h-4 w-4" />
                Analyze requirement
              </Link>
              <Link
                href={`/projects/${selectedProject.id}/generate-testcase`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
              >
                <TestTube2 className="h-4 w-4" />
                Generate test case
              </Link>
            </nav>
          </div>

          {/* System Structure Section */}
          <div className="space-y-2">
            <h3 className="font-bold text-foreground">System structure</h3>
            <nav className="space-y-1 pl-2 border-l-2 border-muted-foreground/20">
              {selectedProject.apps.map((app) => {
                const isActive = currentAppId === app.id
                return (
                  <Link
                    key={app.id}
                    href={`/projects/${selectedProject.id}/apps/${app.id}`}
                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? "bg-background text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-background"
                    }`}
                  >
                    {app.name}
                  </Link>
                )
              })}
              <Link
                href={
                  currentAppId
                    ? `/projects/${selectedProject.id}/apps/${currentAppId}/add-new-feature`
                    : selectedProject.apps.length > 0
                    ? `/projects/${selectedProject.id}/apps/${selectedProject.apps[0].id}/add-new-feature`
                    : `/projects/${selectedProject.id}/add-new-app`
                }
                className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-3 w-3" />
                Add new
              </Link>
            </nav>
          </div>
        </div>
      )}
    </aside>
  )
}
