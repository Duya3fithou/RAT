"use client"

import type { ReactNode } from "react"
import { RatSidebar } from "./sidebar"
import { ProjectProvider } from "@/lib/project-context"

interface RatLayoutProps {
  children: ReactNode
}

export function RatLayout({ children }: RatLayoutProps) {
  return (
    <ProjectProvider>
      <div className="min-h-screen bg-background flex">
        <RatSidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </ProjectProvider>
  )
}
