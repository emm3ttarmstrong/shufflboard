"use client"

import { useState, useRef } from "react"
import { Plus, Link, Upload, ImageIcon, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useCategories } from "@/hooks/use-categories"
import { useCreateResource } from "@/hooks/use-resources"
import { useUpload } from "@/hooks/use-upload"
import { useToast } from "@/hooks/use-toast"

export function AddResourceModal() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("url")
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({})
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [embedCode, setEmbedCode] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: categories } = useCategories()
  const createResource = useCreateResource()
  const { upload, uploading } = useUpload()
  const { toast } = useToast()

  const isSubmitting = createResource.isPending || uploading

  function handleTagChange(category: string, tag: string, checked: boolean) {
    setSelectedTags((prev) => {
      const current = prev[category] || []
      if (checked) {
        return { ...prev, [category]: [...current, tag] }
      } else {
        return { ...prev, [category]: current.filter((t) => t !== tag) }
      }
    })
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for this resource.",
        variant: "destructive",
      })
      return
    }

    try {
      let screenshotUrl: string | undefined

      // Upload image if one is selected
      if (previewImage && fileInputRef.current?.files?.[0]) {
        const result = await upload(fileInputRef.current.files[0])
        if (result) {
          screenshotUrl = result.url
        }
      }

      // Detect if it's a tweet embed
      const isTwitterEmbed =
        embedCode.includes("twitter.com") || embedCode.includes("x.com")

      await createResource.mutateAsync({
        title: title.trim(),
        url: url || undefined,
        screenshot: screenshotUrl,
        embed_code: embedCode || undefined,
        embed_type: isTwitterEmbed ? "twitter" : undefined,
        notes: notes || undefined,
        tags: selectedTags,
      })

      toast({
        title: "Resource saved",
        description: "Your inspiration has been added to your library.",
      })

      // Reset form
      setTitle("")
      setUrl("")
      setNotes("")
      setSelectedTags({})
      setPreviewImage(null)
      setEmbedCode("")
      setActiveTab("url")
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save resource",
        variant: "destructive",
      })
    }
  }

  function handleClose() {
    setOpen(false)
    // Reset form after animation
    setTimeout(() => {
      setTitle("")
      setUrl("")
      setNotes("")
      setSelectedTags({})
      setPreviewImage(null)
      setEmbedCode("")
      setActiveTab("url")
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Inspiration</DialogTitle>
          <DialogDescription>
            Save a design, screenshot, or embed to your library
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Give this inspiration a name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Source Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="url">
                <Link className="h-4 w-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="embed">
                <ImageIcon className="h-4 w-4 mr-2" />
                Embed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/design"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="upload" className="space-y-2">
              <Label>Screenshot</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setPreviewImage(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ""
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-4 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </TabsContent>

            <TabsContent value="embed" className="space-y-2">
              <Label htmlFor="embed">Embed Code (Twitter/X)</Label>
              <Textarea
                id="embed"
                placeholder="Paste embed code here..."
                value={embedCode}
                onChange={(e) => setEmbedCode(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Copy the embed code from Twitter/X share menu
              </p>
            </TabsContent>
          </Tabs>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Why do you like this? What makes it special?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Tags */}
          {categories && categories.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <Accordion type="multiple" className="w-full">
                {categories
                  .filter((cat) => cat.type === "text")
                  .map((category) => {
                    const options = Array.isArray(category.options)
                      ? category.options
                      : []
                    return (
                      <AccordionItem key={category.id} value={category.id}>
                        <AccordionTrigger className="text-sm py-2">
                          {category.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-2">
                            {options.map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`add-${category.name}-${option}`}
                                  checked={(
                                    selectedTags[category.name] || []
                                  ).includes(option)}
                                  onCheckedChange={(checked) =>
                                    handleTagChange(
                                      category.name,
                                      option,
                                      checked as boolean
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`add-${category.name}-${option}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
              </Accordion>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Resource"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
