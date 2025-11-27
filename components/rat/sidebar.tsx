"use client"

import { useState } from "react"
import Link from "next/link"
import { FileSearch, TestTube2, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProject } from "@/lib/project-context"

export function RatSidebar() {
  const { projects, selectedProject, setSelectedProject, isLoading, error } = useProject()
  const [pendingProjectId, setPendingProjectId] = useState<string>("")

  const handleSelectProject = (projectId: string) => {
    setPendingProjectId(projectId)
  }

  const handleConfirm = () => {
    if (pendingProjectId) {
      const project = projects.find((p) => p.id.toString() === pendingProjectId)
      if (project) {
        setSelectedProject(project)
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
          value={pendingProjectId || selectedProject?.id.toString() || ""}
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

        <Button onClick={handleConfirm} className="w-full rounded-lg" disabled={!pendingProjectId && !selectedProject}>
          Confirm
        </Button>
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
              {selectedProject.apps.map((app) => (
                <Link
                  key={app.id}
                  href={`/projects/${selectedProject.id}/apps/${app.id}`}
                  className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors"
                >
                  {app.name}
                </Link>
              ))}
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Plus className="h-3 w-3" />
                Add new
              </button>
            </nav>
          </div>
        </div>
      )}
    </aside>
  )
}
