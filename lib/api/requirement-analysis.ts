import axios from "axios"

export interface ThreadSummary {
  thread_id: string
  last_message_at: string
  message_count: number
  first_message: {
    type: string
    content: string
  }
}

export interface Message {
  id: number
  created_at: string
  updated_at: string
  project_id: number
  thread_id: string
  role: "user" | "ai"
  message: {
    type: string
    content: any
  }
}

export interface AnalyzeResponse {
  thread_id: string
  message: Message
  threads: Message[]
}

// Create axios instance for client-side API calls to Next.js routes
const clientApi = axios.create({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 120 seconds timeout (phân tích có thể mất tới 1 phút)
})

/**
 * Lấy danh sách các threads phân tích yêu cầu
 */
export async function getThreads(projectId: number): Promise<ThreadSummary[]> {
  try {
    console.log("[Client] Fetching threads for project:", projectId)
    
    const response = await clientApi.get<ThreadSummary[]>(
      `/api/projects/${projectId}/requirement-analyze/threads`
    )

    console.log("[Client] getThreads response:", response.data)
    return response.data
  } catch (error) {
    console.error("[Client] getThreads error:", error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }
    
    throw error
  }
}

/**
 * Lấy chi tiết messages của một thread
 */
export async function getThreadMessages(
  projectId: number,
  threadId: string
): Promise<Message[]> {
  try {
    console.log("[Client] Fetching messages for thread:", threadId)
    
    const response = await clientApi.get<Message[]>(
      `/api/projects/${projectId}/requirement-analyze/threads/${threadId}`
    )

    console.log("[Client] getThreadMessages response:", response.data)
    return response.data
  } catch (error) {
    console.error("[Client] getThreadMessages error:", error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }
    
    throw error
  }
}

/**
 * Gửi yêu cầu phân tích mới (tạo thread mới)
 */
export async function analyzeRequirement(
  projectId: number,
  content: string
): Promise<AnalyzeResponse> {
  try {
    console.log("[Client] Analyzing new requirement:", { projectId, content })
    
    const payload = {
      text: content,
    }
    
    const response = await clientApi.post<AnalyzeResponse>(
      `/api/projects/${projectId}/requirement-analyze`,
      payload
    )

    console.log("[Client] analyzeRequirement response:", response.data)
    return response.data
  } catch (error) {
    console.error("[Client] analyzeRequirement error:", error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }
    
    throw error
  }
}

/**
 * Gửi câu hỏi/tin nhắn vào thread đã tồn tại
 */
export async function sendMessageToThread(
  projectId: number,
  threadId: string,
  content: string
): Promise<AnalyzeResponse> {
  try {
    console.log("[Client] Sending message to thread:", { projectId, threadId, content })
    
    const payload = {
      text: content,
    }
    
    const response = await clientApi.post<AnalyzeResponse>(
      `/api/projects/${projectId}/requirement-analyze/${threadId}`,
      payload
    )

    console.log("[Client] sendMessageToThread response:", response.data)
    return response.data
  } catch (error) {
    console.error("[Client] sendMessageToThread error:", error)
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      throw new Error(message)
    }
    
    throw error
  }
}

