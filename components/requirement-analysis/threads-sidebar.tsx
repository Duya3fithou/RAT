"use client"

import { ThreadSummary } from "@/lib/api/requirement-analysis"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Plus, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ThreadsSidebarProps {
  threads: ThreadSummary[]
  selectedThreadId: string | null
  onSelectThread: (threadId: string) => void
  onNewThread: () => void
  isLoading?: boolean
}

export function ThreadsSidebar({
  threads,
  selectedThreadId,
  onSelectThread,
  onNewThread,
  isLoading,
}: ThreadsSidebarProps) {
  return (
    <div className="w-80 border-r bg-muted/30 flex flex-col h-full">
      <div className="p-4 border-b bg-background">
        <Button onClick={onNewThread} className="w-full rounded-xl" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a new conversation to get started
              </p>
            </div>
          ) : (
            threads.map((thread) => (
              <Card
                key={thread.thread_id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  selectedThreadId === thread.thread_id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => onSelectThread(thread.thread_id)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium line-clamp-2 flex-1">
                      {thread.first_message.content}
                    </p>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {thread.message_count}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(thread.last_message_at)}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) {
    return "Just now"
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString("en-US")
  }
}

