"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { RatLayout } from "@/components/rat/layout"
import { useProject } from "@/lib/project-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TestTube2, Loader2, Copy, Check } from "lucide-react"
import { useState } from "react"

function GenerateTestcaseContent() {
  const params = useParams()
  const { projects, selectedProject, setSelectedProject } = useProject()
  const [requirement, setRequirement] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [testCases, setTestCases] = useState<string[] | null>(null)
  const [copied, setCopied] = useState(false)

  const projectId = Number(params.projectId)

  // Auto-select project if not already selected
  useEffect(() => {
    if (projectId && projects.length > 0) {
      if (!selectedProject || selectedProject.id !== projectId) {
        const project = projects.find((p) => p.id === projectId)
        if (project) {
          console.log("[GenerateTestcase] Auto-selecting project:", project.id)
          setSelectedProject(project)
        }
      }
    }
  }, [projectId, projects, selectedProject, setSelectedProject])

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate test case generation
    setTimeout(() => {
      setTestCases([
        "TC001: Verify user can login with valid credentials",
        "TC002: Verify error message for invalid credentials",
        "TC003: Verify password reset functionality",
        "TC004: Verify session timeout after inactivity",
        "TC005: Verify remember me functionality",
      ])
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = () => {
    if (testCases) {
      navigator.clipboard.writeText(testCases.join("\n"))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TestTube2 className="h-8 w-8" />
          Generate Test Case
        </h1>
        {selectedProject && (
          <p className="text-muted-foreground">
            Project: <span className="font-medium text-foreground">{selectedProject.name}</span>
          </p>
        )}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Enter Your Requirement</CardTitle>
          <CardDescription>Paste or type your requirement below to generate test cases automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your requirement here..."
            className="min-h-[200px] rounded-xl"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
          />
          <Button onClick={handleGenerate} disabled={!requirement || isGenerating} className="rounded-xl">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <TestTube2 className="mr-2 h-4 w-4" />
                Generate Test Cases
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {testCases && (
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Test Cases</CardTitle>
              <CardDescription>{testCases.length} test cases generated</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-lg bg-transparent">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {testCases.map((tc, index) => (
                <li key={index} className="p-3 bg-muted rounded-lg text-sm font-mono">
                  {tc}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function GenerateTestcasePage() {
  return (
    <RatLayout>
      <GenerateTestcaseContent />
    </RatLayout>
  )
}
