"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { RatLayout } from "@/components/rat/layout"
import { useProject } from "@/lib/project-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSearch, Loader2, Send, AlertCircle, Download } from "lucide-react"
import { ThreadsSidebar } from "@/components/requirement-analysis/threads-sidebar"
import { MessageItem } from "@/components/requirement-analysis/message-item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  getThreads,
  getThreadMessages,
  analyzeRequirement,
  sendMessageToThread,
  ThreadSummary,
  Message,
} from "@/lib/api/requirement-analysis"
import { toast } from "sonner"
import axios from "axios"

function AnalyzeContent() {
  const params = useParams()
  const { projects, selectedProject, setSelectedProject } = useProject()
  const projectId = Number(params.projectId)

  // State quản lý threads
  const [threads, setThreads] = useState<ThreadSummary[]>([])
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  // State quản lý input và loading
  const [inputContent, setInputContent] = useState("")
  const [isLoadingThreads, setIsLoadingThreads] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendingStatus, setSendingStatus] = useState<"sending" | "analyzing" | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  // State quản lý error
  const [error, setError] = useState<string | null>(null)

  // Ref để auto scroll
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-select project if not already selected
  useEffect(() => {
    if (projectId && projects.length > 0) {
      if (!selectedProject || selectedProject.id !== projectId) {
        const project = projects.find((p) => p.id === projectId)
        if (project) {
          console.log("[Analyze] Auto-selecting project:", project.id)
          setSelectedProject(project)
        }
      }
    }
  }, [projectId, projects, selectedProject, setSelectedProject])

  // Load threads khi component mount hoặc projectId thay đổi
  useEffect(() => {
    if (projectId) {
      // Reset state khi chuyển project
      setSelectedThreadId(null)
      setMessages([])
      setInputContent("")
      setError(null)
      // Load threads mới
      loadThreads()
    }
  }, [projectId])

  // Load messages khi chọn thread
  useEffect(() => {
    if (selectedThreadId && projectId) {
      loadMessages(selectedThreadId)
    }
  }, [selectedThreadId, projectId])

  // Auto scroll khi có message mới
  useEffect(() => {
    scrollToBottom()
  }, [messages, isSending])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadThreads = async () => {
    try {
      setIsLoadingThreads(true)
      setError(null)
      const data = await getThreads(projectId)
      setThreads(data)
    } catch (err: any) {
      console.error("Error loading threads:", err)
      setError(err.message || "Failed to load conversations")
      toast.error("Failed to load conversations")
    } finally {
      setIsLoadingThreads(false)
    }
  }

  const loadMessages = async (threadId: string) => {
    try {
      setIsLoadingMessages(true)
      setError(null)
      const data = await getThreadMessages(projectId, threadId)
      setMessages(data)
    } catch (err: any) {
      console.error("Error loading messages:", err)
      setError(err.message || "Failed to load messages")
      toast.error("Failed to load messages")
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleNewThread = () => {
    setSelectedThreadId(null)
    setMessages([])
    setInputContent("")
    setError(null)
  }

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId)
    setInputContent("")
    setError(null)
  }

  const handleSendMessage = async () => {
    if (!inputContent.trim()) {
      return
    }

    const content = inputContent.trim()
    setInputContent("")

    try {
      setIsSending(true)
      setSendingStatus("sending")
      setError(null)

      // Tạo tin nhắn user tạm thời
      const tempUserMessage: Message = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: projectId,
        thread_id: selectedThreadId || "",
        role: "user",
        message: {
          type: selectedThreadId ? "question" : "analyze_requirement",
          content: content,
        },
      }

      setMessages((prev) => [...prev, tempUserMessage])

      // Đổi status sang analyzing sau 500ms
      setTimeout(() => {
        setSendingStatus("analyzing")
      }, 500)

      // Gọi API - khác nhau tùy theo có thread_id hay không
      let response
      if (selectedThreadId) {
        // Gửi message vào thread đã tồn tại
        response = await sendMessageToThread(projectId, selectedThreadId, content)
      } else {
        // Tạo thread mới
        response = await analyzeRequirement(projectId, content)
      }

      // Cập nhật state
      if (!selectedThreadId) {
        // Thread mới - set thread_id và load all messages
        setSelectedThreadId(response.thread_id)
        setMessages(response.threads)
        // Reload threads list
        await loadThreads()
      } else {
        // Thread hiện tại - load lại toàn bộ messages từ response
        setMessages(response.threads)
        // Reload threads list để cập nhật last_message_at
        await loadThreads()
      }

      toast.success("Analysis completed!")
    } catch (err: any) {
      console.error("Error sending message:", err)
      setError(err.message || "Failed to send message")
      toast.error("Failed to send message")
      // Remove temp message on error
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsSending(false)
      setSendingStatus(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDownloadTestcases = async () => {
    if (!selectedThreadId) {
      toast.error("Please select a conversation first")
      return
    }

    try {
      setIsDownloading(true)
      setError(null)

      const apiUrl = `/api/projects/${projectId}/requirement-analyze/threads/${selectedThreadId}/test-cases`
      console.log("[Download] Fetching test cases from:", apiUrl)

      const response = await axios.get(apiUrl, {
        responseType: "blob",
      })

      // Tạo blob URL và trigger download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Tạo tên file với timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      link.download = `testcases_${selectedThreadId}_${timestamp}.xlsx`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Test cases downloaded successfully!")
    } catch (err: any) {
      console.error("Error downloading test cases:", err)
      const errorMessage = err.response?.data?.error || err.message || "Failed to download test cases"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar - Danh sách threads */}
      <ThreadsSidebar
        threads={threads}
        selectedThreadId={selectedThreadId}
        onSelectThread={handleSelectThread}
        onNewThread={handleNewThread}
        isLoading={isLoadingThreads}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background p-4">
          <div className="max-w-5xl mx-auto flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <FileSearch className="h-6 w-6" />
                Analyze Requirement
              </h1>
              {selectedProject && (
                <p className="text-sm text-muted-foreground mt-1">
                  Project: <span className="font-medium text-foreground">{selectedProject.name}</span>
                </p>
              )}
            </div>
            {selectedThreadId && (
              <Button
                onClick={handleDownloadTestcases}
                disabled={isDownloading}
                variant="outline"
                className="rounded-xl"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download testcases
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-5xl mx-auto space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoadingMessages ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 && !selectedThreadId ? (
              // Default interface when there's no thread
              <Card className="rounded-2xl mt-8">
                <CardHeader>
                  <CardTitle>Enter Your Requirement</CardTitle>
                  <CardDescription>
                    Paste or type your requirement below to analyze its completeness and clarity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <FileSearch className="h-24 w-24 text-muted-foreground/30" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Hiển thị messages
              <>
                {messages.map((message) => (
                  <MessageItem key={message.id} message={message} />
                ))}

                {/* Loading indicator when sending */}
                {isSending && sendingStatus && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                    <Card className="inline-block bg-muted rounded-2xl">
                      <div className="p-4">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">
                            {sendingStatus === "sending" ? "Sending..." : "Analyzing..."}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="border-t bg-background p-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-3">
              <Textarea
                placeholder={
                  selectedThreadId
                    ? "Enter your question..."
                    : "Enter requirement to analyze..."
                }
                className="min-h-[60px] max-h-[200px] rounded-xl resize-none"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputContent.trim() || isSending}
                className="rounded-xl px-6"
                size="lg"
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press <kbd className="px-1.5 py-0.5 text-xs border rounded">Enter</kbd> to send,{" "}
              <kbd className="px-1.5 py-0.5 text-xs border rounded">Shift + Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <RatLayout>
      <AnalyzeContent />
    </RatLayout>
  )
}
