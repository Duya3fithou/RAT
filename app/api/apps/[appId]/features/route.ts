import { NextResponse } from "next/server"
import axios from "axios"

const BASE_URL = "http://rat-api.eba-qsjc6vnd.us-east-1.elasticbeanstalk.com"

export async function POST(
  request: Request,
  { params }: { params: { appId: string } }
) {
  try {
    const body = await request.json()
    const { name, description, attachments, features } = body

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      )
    }

    console.log("[API] Creating feature for app:", params.appId, body)

    const response = await axios.post(
      `${BASE_URL}/apps/${params.appId}/features`,
      {
        name,
        description,
        attachments: attachments || [],
        features: features || [],
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    )

    console.log("[API] Create feature response:", response.data)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("[API] Failed to create feature:", error)

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message = error.response?.data?.message || error.message
      return NextResponse.json(
        { error: "Failed to create feature", details: message },
        { status }
      )
    }

    return NextResponse.json(
      { error: "Failed to create feature", details: String(error) },
      { status: 500 }
    )
  }
}

