"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Project, getProjects } from "@/lib/api/projects"

interface ProjectContextType {
  projects: Project[]
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
  isLoading: boolean
  error: string | null
  refreshProjects: () => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      setError(null) // Reset error state
      const data = await getProjects()
      console.log("[ProjectContext] Fetched projects:", data)
      setProjects(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch projects"
      setError(errorMessage)
      console.error("[ProjectContext] Error fetching projects:", err)
      setProjects([]) // Reset to empty array on error
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProjects = async () => {
    const data = await fetchProjects()
    
    // Re-select the current project to get updated data
    if (selectedProject) {
      const updatedProject = data.find((p) => p.id === selectedProject.id)
      if (updatedProject) {
        setSelectedProject(updatedProject)
        if (typeof window !== "undefined") {
          localStorage.setItem("selectedProjectId", updatedProject.id.toString())
        }
      }
    }
  }

  // Custom setSelectedProject that also saves to localStorage
  const handleSetSelectedProject = (project: Project | null) => {
    setSelectedProject(project)
    if (typeof window !== "undefined" && project) {
      localStorage.setItem("selectedProjectId", project.id.toString())
      console.log("[ProjectContext] Selected project saved:", project.id)
    } else if (typeof window !== "undefined") {
      localStorage.removeItem("selectedProjectId")
    }
  }

  // Set mounted flag to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load projects and restore selected project from localStorage
  useEffect(() => {
    if (!mounted) return

    const loadProjectsAndRestore = async () => {
      const projectsData = await fetchProjects()
      
      // Try to restore selected project from localStorage
      const savedProjectId = localStorage.getItem("selectedProjectId")
      if (savedProjectId && projectsData.length > 0) {
        const project = projectsData.find((p) => p.id.toString() === savedProjectId)
        if (project) {
          setSelectedProject(project)
          console.log("[ProjectContext] Restored project from localStorage:", project.id)
        }
      }
    }
    
    loadProjectsAndRestore()
  }, [mounted])

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject: handleSetSelectedProject,
        isLoading,
        error,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}
