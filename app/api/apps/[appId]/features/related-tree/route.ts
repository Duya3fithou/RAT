import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/config"

export async function GET(
  request: NextRequest,
  { params }: { params: { appId: string } }
) {
  try {
    const { appId } = params
    console.log(`[API Route] GET /api/apps/${appId}/features/related-tree`)

    const response = await apiClient.get(`/apps/${appId}/features/related-tree`)

    console.log("[API Route] Related features tree fetched successfully:", {
      appId,
      appsCount: response.data?.length || 0,
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("[API Route] Error fetching related features tree:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to fetch related features tree" },
      { status: error.response?.status || 500 }
    )
  }
}

