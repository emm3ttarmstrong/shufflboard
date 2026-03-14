"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface PromptPreviewProps {
  prompt: string
  selectionCount: number
  totalCategories: number
}

export function PromptPreview({
  prompt,
  selectionCount,
  totalCategories,
}: PromptPreviewProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      toast({ title: "Copied to clipboard" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: "Failed to copy",
        variant: "destructive",
      })
    }
  }

  const isEmpty = selectionCount === 0

  return (
    <Card className="sticky top-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base font-semibold">
            Prompt Preview
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {selectionCount} of {totalCategories} categories selected
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={isEmpty}
        >
          {copied ? (
            <Check className="mr-2 h-3.5 w-3.5" />
          ) : (
            <Copy className="mr-2 h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(selectionCount / totalCategories) * 100}%`,
              }}
            />
          </div>
        </div>

        {isEmpty ? (
          <p className="text-sm text-muted-foreground italic">
            Select options or shuffle to generate a design prompt...
          </p>
        ) : (
          <p className="text-sm leading-relaxed">{prompt}</p>
        )}
        {!isEmpty && (
          <p className="text-xs text-muted-foreground mt-3">
            {prompt.length} characters
          </p>
        )}
      </CardContent>
    </Card>
  )
}
