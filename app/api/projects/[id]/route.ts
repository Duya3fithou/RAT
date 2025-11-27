import { NextResponse } from "next/server"
import axios from "axios"

const BASE_URL = "http://rat-api.eba-qsjc6vnd.us-east-1.elasticbeanstalk.com"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Fetching project by id from:", `${BASE_URL}/projects/${params.id}`)

    const response = await axios.get(`${BASE_URL}/projects/${params.id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds timeout
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response data:", response.data)

    const data = response.data

    // Check if response status is successful (2xx)
    if (response.status < 200 || response.status >= 300) {
      return NextResponse.json(
        { error: `API error: ${response.status}`, details: data },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Failed to fetch project:", error)
    
    // Handle axios errors properly
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message = error.response?.data?.message || error.message
      return NextResponse.json(
        { error: "Failed to fetch project", details: message },
        { status }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to fetch project", details: String(error) },
      { status: 500 }
    )
  }
}
