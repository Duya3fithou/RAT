import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/config"

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; appId: string } }
) {
  try {
    const { projectId, appId } = params
    console.log(`[API Route] GET /api/projects/${projectId}/apps/${appId}`)

    const response = await apiClient.get(`/projects/${projectId}/apps/${appId}`)

    console.log("[API Route] App detail fetched successfully:", {
      appId,
      name: response.data.name,
      featuresCount: response.data.features?.length || 0,
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("[API Route] Error fetching app detail:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to fetch app detail" },
      { status: error.response?.status || 500 }
    )
  }
}

