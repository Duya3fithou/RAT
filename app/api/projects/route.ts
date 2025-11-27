import { NextResponse } from "next/server"
import axios from "axios"
import { Project } from "@/lib/api/projects"

const BASE_URL = "http://rat-api.eba-qsjc6vnd.us-east-1.elasticbeanstalk.com"

export async function GET() {
  try {
    console.log("[v0] Fetching projects from:", `${BASE_URL}/projects`)

    const response = await axios.get<Project[]>(`${BASE_URL}/projects`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds timeout
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response data:", response.data)

    // Axios automatically parses JSON and puts it in response.data
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
    console.error("[v0] Failed to fetch projects:", error)
    
    // Handle axios errors properly
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message = error.response?.data?.message || error.message
      return NextResponse.json(
        { error: "Failed to fetch projects", details: message },
        { status }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to fetch projects", details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      )
    }

    console.log("[v0] Creating project:", { name, description })

    const response = await axios.post<Project>(
      `${BASE_URL}/projects`,
      { name, description },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 seconds timeout
      }
    )

    console.log("[v0] Create project response status:", response.status)
    console.log("[v0] Create project response data:", response.data)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("[v0] Failed to create project:", error)
    
    // Handle axios errors properly
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const message = error.response?.data?.message || error.message
      return NextResponse.json(
        { error: "Failed to create project", details: message },
        { status }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create project", details: String(error) },
      { status: 500 }
    )
  }
}
