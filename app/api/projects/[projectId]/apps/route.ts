import { NextResponse } from "next/server"
import axios from "axios"

const BASE_URL = "http://rat-api.eba-qsjc6vnd.us-east-1.elasticbeanstalk.com"

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json()
    const { name, type } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    console.log("[API] Creating app for project:", params.projectId, body)

    const response = await axios.post(
      `${BASE_URL}/projects/${params.projectId}/apps`,
      {
        name,
        type,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    )

    console.log("[API] Create app response:", response.data)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("[API] Failed to create app:", error)

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message = error.response?.data?.message || error.message
      return NextResponse.json(
        { error: "Failed to create app", details: message },
        { status }
      )
    }

    return NextResponse.json(
      { error: "Failed to create app", details: String(error) },
      { status: 500 }
    )
  }
}

