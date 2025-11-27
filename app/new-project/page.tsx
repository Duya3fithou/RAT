import Link from "next/link"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex justify-center items-start">
      <Card className="w-full max-w-4xl rounded-3xl shadow-lg border-muted/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-end gap-4 p-6 border-b border-border/50 bg-muted/10">
          <Button className="rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
            Save changes
          </Button>
          <Button variant="ghost" className="rounded-xl text-muted-foreground hover:text-destructive">
            Delete
          </Button>
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <X className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <CardContent className="p-6 md:p-10 space-y-8">
          {/* Title Section */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-lg font-bold">
              Title
            </Label>
            <Input
              id="title"
              defaultValue="Web"
              className="text-lg font-medium rounded-xl border-muted-foreground/20 h-12"
            />
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-lg font-bold">
              Description:
            </Label>
            <Textarea
              id="description"
              className="min-h-[150px] rounded-2xl border-muted-foreground/20 resize-none p-4 text-base"
              placeholder="Enter project description..."
            />
          </div>

          {/* Function 1 */}
          <div className="space-y-4 p-6 rounded-3xl bg-muted/30 border border-border/50">
            <div className="space-y-3">
              <Label htmlFor="func1" className="text-base font-semibold">
                1. Function 1:
              </Label>
              <Input
                id="func1"
                placeholder="Describe function"
                className="rounded-xl border-muted-foreground/20 bg-background"
              />
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-indigo-500/20">
              <Label className="text-sm font-medium text-muted-foreground">
                Related function (optional)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select>
                  <SelectTrigger className="rounded-xl bg-background border-muted-foreground/20">
                    <SelectValue placeholder="Select a function" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="func-a">Function A</SelectItem>
                    <SelectItem value="func-b">Function B</SelectItem>
                    <SelectItem value="func-c">Function C</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Describe relation"
                  className="rounded-xl border-muted-foreground/20 bg-background"
                />
              </div>
            </div>
          </div>

          {/* Function 2 */}
          <div className="space-y-4 p-6 rounded-3xl bg-muted/30 border border-border/50">
            <div className="space-y-3">
              <Label htmlFor="func2" className="text-base font-semibold">
                2. Function 2:
              </Label>
              <Input
                id="func2"
                placeholder="Describe function"
                className="rounded-xl border-muted-foreground/20 bg-background"
              />
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-indigo-500/20">
              <Label className="text-sm font-medium text-muted-foreground">
                Related function (optional)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select>
                  <SelectTrigger className="rounded-xl bg-background border-muted-foreground/20">
                    <SelectValue placeholder="Select a function" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="func-x">Function X</SelectItem>
                    <SelectItem value="func-y">Function Y</SelectItem>
                    <SelectItem value="func-z">Function Z</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Describe relation"
                  className="rounded-xl border-muted-foreground/20 bg-background"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
