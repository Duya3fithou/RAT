import axios from "axios"

// Create axios instance for client-side API calls to Next.js routes
const clientApi = axios.create({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
})

export interface SubFeature {
  name: string
  description: string
}

export interface CreateFeatureParams {
  name: string
  description: string
  attachments?: string[]
  features?: SubFeature[]
}

export interface RelatedFeature {
  id: number
  code: string
  name: string
}

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
  attachments: string[]
  related_features: RelatedFeature[]
  embedding: string | null
  children?: Feature[]
}

export async function createFeature(
  appId: number,
  params: CreateFeatureParams
): Promise<Feature> {
  try {
    console.log("[Client] Creating feature for app:", appId, params)

    const response = await clientApi.post<Feature>(
      `/api/apps/${appId}/features`,
      params
    )

    console.log("[Client] createFeature response:", response.data)

    return response.data
  } catch (error) {
    console.error("[Client] createFeature error:", error)

    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }

    throw error
  }
}

export async function getFeaturesByAppId(appId: number): Promise<Feature[]> {
  try {
    console.log("[Client] Fetching features for app:", appId)

    const response = await clientApi.get<Feature[]>(`/api/apps/${appId}/features`)

    console.log("[Client] getFeaturesByAppId response:", response.data)

    return response.data
  } catch (error) {
    console.error("[Client] getFeaturesByAppId error:", error)

    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }

    throw error
  }
}

