import axios from "axios"

export interface Feature {
  id: number
  created_at: string
  updated_at: string
  project_app_id: number
  parent_feature_id: number | null
  code: string
  name: string
  description: string
  order_index: number
  attachments: any[]
  children?: Feature[]
}

export interface AppDetail {
  id: number
  created_at: string
  updated_at: string
  project: {
    id: number
    created_at: string
    updated_at: string
    code: string
    name: string
    description: string
  }
  project_id: number
  name: string
  type: string
  description: string
  features: Feature[]
}

export interface RelatedFeatureChild {
  id: number
  name: string
}

export interface RelatedFeatureParent {
  id: number
  name: string
  children: RelatedFeatureChild[]
}

export interface RelatedAppFeatures {
  app_id: number
  app_name: string
  features: RelatedFeatureParent[]
}

// Create axios instance for client-side API calls to Next.js routes
const clientApi = axios.create({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
})

export async function getAppDetail(projectId: number, appId: number): Promise<AppDetail> {
  try {
    console.log("[Client] Fetching app detail:", { projectId, appId })
    
    const response = await clientApi.get<AppDetail>(`/api/projects/${projectId}/apps/${appId}`)

    console.log("[Client] getAppDetail response:", {
      appId: response.data.id,
      name: response.data.name,
      featuresCount: response.data.features?.length || 0,
    })

    return response.data
  } catch (error) {
    console.error("[Client] getAppDetail error:", error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }
    
    throw error
  }
}

export async function getRelatedFeaturesTree(appId: number): Promise<RelatedAppFeatures[]> {
  try {
    console.log("[Client] Fetching related features tree:", { appId })
    
    const response = await clientApi.get<RelatedAppFeatures[]>(`/api/apps/${appId}/features/related-tree`)

    console.log("[Client] getRelatedFeaturesTree response:", {
      appId,
      appsCount: response.data?.length || 0,
    })

    return response.data
  } catch (error) {
    console.error("[Client] getRelatedFeaturesTree error:", error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }
    
    throw error
  }
}

