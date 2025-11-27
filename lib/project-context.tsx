"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Project, getProjects } from "@/lib/api/projects"

interface ProjectContextType {
  projects: Project[]
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
  isLoading: boolean
  error: string | null
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)
        setError(null) // Reset error state
        const data = await getProjects()
        console.log("[ProjectContext] Fetched projects:", data)
        setProjects(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch projects"
        setError(errorMessage)
        console.error("[ProjectContext] Error fetching projects:", err)
        setProjects([]) // Reset to empty array on error
      } finally {
        setIsLoading(false)
      }
    }
    
    // Small delay to avoid hydration mismatch
    const timeoutId = setTimeout(() => {
      fetchProjects()
    }, 0)
    
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject,
        isLoading,
        error,
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
