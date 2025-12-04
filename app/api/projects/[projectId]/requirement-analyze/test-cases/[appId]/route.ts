import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/config"

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; appId: string } }
) {
  try {
    const { projectId, appId } = params
    console.log(`[API Route] GET /api/projects/${projectId}/requirement-analyze/test-cases/${appId}`)

    const response = await apiClient.get(
      `/projects/${projectId}/requirement-analyze/test-cases/${appId}`,
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
        "Content-Disposition": `attachment; filename="testcases_app_${appId}.xlsx"`,
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

