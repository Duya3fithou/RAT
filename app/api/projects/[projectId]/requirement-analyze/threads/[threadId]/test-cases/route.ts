import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/config"

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; threadId: string } }
) {
  try {
    const { projectId, threadId } = params
    console.log(`[API Route] GET /api/projects/${projectId}/requirement-analyze/threads/${threadId}/test-cases`)

    const response = await apiClient.get(
      `/projects/${projectId}/requirement-analyze/threads/${threadId}/test-cases`,
      {
        responseType: "arraybuffer",
        headers: {
          "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      }
    )

    // Trả về file Excel
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="testcases_${threadId}.xlsx"`,
      },
    })
  } catch (error: any) {
    console.error("[API Route] Error downloading test cases:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to download test cases" },
      { status: error.response?.status || 500 }
    )
  }
}

