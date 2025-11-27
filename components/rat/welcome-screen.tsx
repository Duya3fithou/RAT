"use client"

import { useProject } from "@/lib/project-context"

export function WelcomeScreen() {
  const { selectedProject } = useProject()

  return (
    <div className="h-full flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
          WELCOME TO OFFSPRING DIGITAL
        </h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
          REQUIREMENT ANALYSIS TOOL
        </h2>
        {selectedProject && (
          <p className="text-muted-foreground mt-4">
            Currently working on: <span className="font-semibold text-foreground">{selectedProject.name}</span>
          </p>
        )}
      </div>
    </div>
  )
}
