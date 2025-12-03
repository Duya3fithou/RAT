"use client"

import { Message } from "@/lib/api/requirement-analysis"
import { Card } from "@/components/ui/card"
import { Bot, User, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MessageItemProps {
  message: Message
  isLoading?: boolean
}

export function MessageItem({ message, isLoading }: MessageItemProps) {
  const isUser = message.role === "user"
  const messageContent = message.message.content

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`flex-1 ${isUser ? "flex flex-col items-end" : "flex flex-col"}`}>
        <Card
          className={`inline-block max-w-[85%] ${
            isUser
              ? "bg-primary text-primary-foreground rounded-2xl"
              : "bg-muted rounded-2xl"
          }`}
        >
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Analyzing...</span>
              </div>
            ) : (
              <MessageContent message={message} />
            )}
          </div>
        </Card>

        <div className={`text-xs text-muted-foreground mt-1 px-2`}>
          {new Date(message.created_at).toLocaleString("en-US")}
        </div>
      </div>
    </div>
  )
}

function MessageContent({ message }: { message: Message }) {
  const messageType = message.message.type
  const content = message.message.content

  // User message
  if (message.role === "user") {
    if (messageType === "analyze_requirement") {
      return (
      <div>
        <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
          Analysis Request
        </Badge>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      )
    }
    if (messageType === "question") {
      return (
        <div>
          <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-white/30 hover:bg-white/30">
            Question
          </Badge>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      )
    }
    return <p className="whitespace-pre-wrap">{content}</p>
  }

  // AI message
  if (messageType === "requirement_analysis") {
    return <RequirementAnalysisContent content={content} />
  }

  if (messageType === "answer") {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    )
  }

  return <p className="whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</p>
}

function RequirementAnalysisContent({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Analysis Result</h3>
        <p className="text-sm font-medium mb-2">
          <strong>Requirement:</strong> {content.requirement}
        </p>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {/* Suggested Apps */}
        {content.suggested_apps && content.suggested_apps.length > 0 && (
          <AccordionItem value="apps" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              🎯 Suggested Apps ({content.suggested_apps.length})
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {content.suggested_apps.map((app: any, idx: number) => (
                <Card key={idx} className="p-3 bg-background">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{app.app_name}</p>
                      <Badge variant={app.confidence > 0.6 ? "default" : "secondary"}>
                        {Math.round(app.confidence * 100)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.reasoning}</p>
                  </div>
                </Card>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Main Flow */}
        {content.main_flow && content.main_flow.length > 0 && (
          <AccordionItem value="main-flow" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              ✅ Main Flow ({content.main_flow.length} steps)
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {content.main_flow.map((step: any) => (
                <div key={step.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">{step.actor}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Unhappy Flow */}
        {content.unhappy_flow && content.unhappy_flow.length > 0 && (
          <AccordionItem value="unhappy-flow" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              ⚠️ Unhappy Flow ({content.unhappy_flow.length} steps)
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {content.unhappy_flow.map((step: any) => (
                <div key={step.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center text-xs font-semibold">
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-600">{step.actor}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Alternate Flows */}
        {content.alternate_flows && content.alternate_flows.length > 0 && (
          <AccordionItem value="alternate-flows" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              🔄 Alternate Flows ({content.alternate_flows.length})
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              {content.alternate_flows.map((flow: any, idx: number) => (
                <Card key={idx} className="p-3 bg-background">
                  <p className="font-medium mb-2">{flow.name}</p>
                  <div className="space-y-2">
                    {flow.steps.map((step: any) => (
                      <div key={step.id} className="flex gap-2 text-sm">
                        <span className="text-muted-foreground">{step.id}.</span>
                        <div>
                          <span className="font-medium text-blue-600">{step.actor}</span>
                          <span className="text-muted-foreground">: {step.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Negative Flows */}
        {content.negative_flows && content.negative_flows.length > 0 && (
          <AccordionItem value="negative-flows" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              ❌ Negative Flows ({content.negative_flows.length})
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              {content.negative_flows.map((flow: any, idx: number) => (
                <Card key={idx} className="p-3 bg-background">
                  <p className="font-medium mb-2">{flow.name}</p>
                  <div className="space-y-2">
                    {flow.steps.map((step: any) => (
                      <div key={step.id} className="flex gap-2 text-sm">
                        <span className="text-muted-foreground">{step.id}.</span>
                        <div>
                          <span className="font-medium text-red-600">{step.actor}</span>
                          <span className="text-muted-foreground">: {step.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Acceptance Criteria */}
        {content.acceptance_criteria && content.acceptance_criteria.length > 0 && (
          <AccordionItem value="acceptance" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              ✓ Acceptance Criteria ({content.acceptance_criteria.length})
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <ul className="space-y-2">
                {content.acceptance_criteria.map((criteria: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-green-600 flex-shrink-0">•</span>
                    <span className="text-muted-foreground">{criteria}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Risks */}
        {content.risks && content.risks.length > 0 && (
          <AccordionItem value="risks" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              ⚡ Risks ({content.risks.length})
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <ul className="space-y-2">
                {content.risks.map((risk: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-red-600 flex-shrink-0">•</span>
                    <span className="text-muted-foreground">{risk}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Notes */}
        {content.notes && (
          <AccordionItem value="notes" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              📝 Notes
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <p className="text-sm text-muted-foreground">{content.notes}</p>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}

