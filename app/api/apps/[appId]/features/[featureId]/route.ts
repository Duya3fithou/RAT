import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/config"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { appId: string; featureId: string } }
) {
  try {
    const { appId, featureId } = params
    const body = await request.json()
    
    console.log(`[API Route] PATCH /api/apps/${appId}/features/${featureId}`, body)

    const response = await apiClient.patch(`/apps/${appId}/features/${featureId}`, body)

    console.log("[API Route] Feature updated successfully:", featureId)

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("[API Route] Error updating feature:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to update feature" },
      { status: error.response?.status || 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { appId: string; featureId: string } }
) {
  try {
    const { appId, featureId } = params
    
    console.log(`[API Route] DELETE /api/apps/${appId}/features/${featureId}`)

    await apiClient.delete(`/apps/${appId}/features/${featureId}`)

    console.log("[API Route] Feature deleted successfully:", featureId)

    return NextResponse.json({ success: true, message: "Feature deleted successfully" })
  } catch (error: any) {
    console.error("[API Route] Error deleting feature:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to delete feature" },
      { status: error.response?.status || 500 }
    )
  }
}

