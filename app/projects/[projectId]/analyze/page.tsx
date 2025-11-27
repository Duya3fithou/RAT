"use client"

import { RatLayout } from "@/components/rat/layout"
import { useProject } from "@/lib/project-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSearch, Loader2 } from "lucide-react"
import { useState } from "react"

function AnalyzeContent() {
  const { selectedProject } = useProject()
  const [requirement, setRequirement] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setResult("Analysis complete. The requirement is well-defined and can be implemented.")
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileSearch className="h-8 w-8" />
          Analyze Requirement
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
          <CardDescription>
            Paste or type your requirement below to analyze its completeness and clarity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your requirement here..."
            className="min-h-[200px] rounded-xl"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
          />
          <Button onClick={handleAnalyze} disabled={!requirement || isAnalyzing} className="rounded-xl">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileSearch className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="rounded-2xl border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-600">Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{result}</p>
          </CardContent>
        </Card>
      )}
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
