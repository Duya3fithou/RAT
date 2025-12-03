import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/config"

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId
    const body = await request.json()
    
    console.log(`[API Route] POST /api/projects/${projectId}/requirement-analyze`, body)

    const response = await apiClient.post(
      `/projects/${projectId}/requirement-analyze`,
      body
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("[API Route] Error analyzing requirement:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to analyze requirement" },
      { status: error.response?.status || 500 }
    )
  }
}

