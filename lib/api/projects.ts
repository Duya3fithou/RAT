import axios from "axios"

export interface App {
  id: number
  created_at: string
  updated_at: string
  project_id: number
  name: string
  type: string
  description: string
}

export interface Project {
  id: number
  created_at: string
  updated_at: string
  code: string
  name: string
  description: string
  apps: App[]
}

// Create axios instance for client-side API calls to Next.js routes
const clientApi = axios.create({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
})

export async function getProjects(): Promise<Project[]> {
  try {
    console.log("[Client] Fetching projects from Next.js API route")
    
    const response = await clientApi.get<Project[]>("/api/projects")

    console.log("[Client] getProjects response:", {
      status: response.status,
      data: response.data,
    })

    const data = response.data

    // Handle different response formats
    if (Array.isArray(data)) {
      return data
    }
    
    // Check if data is an object with nested array
    if (data && typeof data === "object") {
      const dataObj = data as Record<string, unknown>
      
      if ("data" in dataObj && Array.isArray(dataObj.data)) {
        return dataObj.data as Project[]
      }
      
      if ("projects" in dataObj && Array.isArray(dataObj.projects)) {
        return dataObj.projects as Project[]
      }
    }

    console.error("[Client] Unexpected data format:", data)
    return []
  } catch (error) {
    console.error("[Client] getProjects error:", error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }
    
    throw error
  }
}

export async function getProjectById(id: number): Promise<Project> {
  try {
    console.log("[Client] Fetching project by id:", id)
    
    const response = await clientApi.get<Project>(`/api/projects/${id}`)

    console.log("[Client] getProjectById response:", response.data)

    return response.data
  } catch (error) {
    console.error("[Client] getProjectById error:", error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }
    
    throw error
  }
}

export interface CreateProjectParams {
  name: string
  description: string
}

export async function createProject(params: CreateProjectParams): Promise<Project> {
  try {
    console.log("[Client] Creating project:", params)
    
    const response = await clientApi.post<Project>("/api/projects", params)

    console.log("[Client] createProject response:", response.data)

    return response.data
  } catch (error) {
    console.error("[Client] createProject error:", error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }
    
    throw error
  }
}
