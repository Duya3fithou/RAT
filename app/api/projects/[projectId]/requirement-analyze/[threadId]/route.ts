import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/config"

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string; threadId: string } }
) {
  try {
    const { projectId, threadId } = params
    const body = await request.json()
    
    console.log(`[API Route] POST /api/projects/${projectId}/requirement-analyze/${threadId}`, body)

    const response = await apiClient.post(
      `/projects/${projectId}/requirement-analyze/${threadId}`,
      body
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("[API Route] Error sending message to thread:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to send message to thread" },
      { status: error.response?.status || 500 }
    )
  }
}

