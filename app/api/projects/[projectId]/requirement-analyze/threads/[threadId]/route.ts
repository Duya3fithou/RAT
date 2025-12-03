import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/config"

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; threadId: string } }
) {
  try {
    const { projectId, threadId } = params
    console.log(`[API Route] GET /api/projects/${projectId}/requirement-analyze/threads/${threadId}`)

    const response = await apiClient.get(
      `/projects/${projectId}/requirement-analyze/threads/${threadId}`
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("[API Route] Error fetching thread messages:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to fetch thread messages" },
      { status: error.response?.status || 500 }
    )
  }
}

