import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/config"

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId
    console.log(`[API Route] GET /api/projects/${projectId}/requirement-analyze/threads`)

    const response = await apiClient.get(
      `/projects/${projectId}/requirement-analyze/threads`
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("[API Route] Error fetching threads:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to fetch threads" },
      { status: error.response?.status || 500 }
    )
  }
}

