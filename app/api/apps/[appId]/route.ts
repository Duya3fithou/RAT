import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/config"

export async function PUT(
  request: NextRequest,
  { params }: { params: { appId: string } }
) {
  try {
    const { appId } = params
    const body = await request.json()
    
    console.log(`[API Route] PUT /api/apps/${appId}`, body)

    const response = await apiClient.put(`/apps/${appId}`, body)

    console.log("[API Route] App updated successfully:", appId)

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("[API Route] Error updating app:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to update app" },
      { status: error.response?.status || 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { appId: string } }
) {
  try {
    const { appId } = params
    console.log(`[API Route] DELETE /api/apps/${appId}`)

    await apiClient.delete(`/apps/${appId}`)

    console.log("[API Route] App deleted successfully:", appId)

    return NextResponse.json({ success: true, message: "App deleted successfully" })
  } catch (error: any) {
    console.error("[API Route] Error deleting app:", error)
    
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || "Failed to delete app" },
      { status: error.response?.status || 500 }
    )
  }
}

