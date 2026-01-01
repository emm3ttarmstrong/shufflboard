"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, Trash2, MoreVertical, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDeleteResource } from "@/hooks/use-resources"
import { useToast } from "@/hooks/use-toast"
import type { Resource } from "@/types"

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const [showDetail, setShowDetail] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const deleteResource = useDeleteResource()
  const { toast } = useToast()

  const allTags = Object.entries(resource.tags || {}).flatMap(
    ([category, tags]) => tags.map((tag) => ({ category, tag }))
  )

  async function handleDelete() {
    try {
      await deleteResource.mutateAsync(resource.id)
      toast({
        title: "Resource deleted",
        description: "The resource has been removed from your library.",
      })
      setShowDeleteConfirm(false)
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete resource",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-md transition-shadow">
        <div
          className="relative aspect-video bg-muted cursor-pointer"
          onClick={() => setShowDetail(true)}
        >
          {resource.screenshot ? (
            <Image
              src={resource.screenshot}
              alt={resource.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : resource.embed_type === "twitter" && resource.embed_code ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100">
              <span className="text-2xl">𝕏</span>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground text-sm">No preview</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>

        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate" title={resource.title}>
                {resource.title}
              </h3>
              {resource.notes && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {resource.notes}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetail(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
                {resource.url && (
                  <DropdownMenuItem asChild>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open URL
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {allTags.slice(0, 3).map(({ category, tag }) => (
                <Badge key={`${category}-${tag}`} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {allTags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{allTags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{resource.title}</DialogTitle>
            {resource.notes && (
              <DialogDescription>{resource.notes}</DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview */}
            {resource.screenshot && (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <Image
                  src={resource.screenshot}
                  alt={resource.title}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {resource.embed_type === "twitter" && resource.embed_code && (
              <div
                className="twitter-embed"
                dangerouslySetInnerHTML={{ __html: resource.embed_code }}
              />
            )}

            {/* URL */}
            {resource.url && (
              <div>
                <p className="text-sm font-medium mb-1">Source URL</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {resource.url}
                </a>
              </div>
            )}

            {/* Tags */}
            {allTags.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {allTags.map(({ category, tag }) => (
                    <Badge key={`${category}-${tag}`} variant="secondary">
                      <span className="text-muted-foreground mr-1">
                        {category}:
                      </span>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-muted-foreground">
              Added {new Date(resource.created_at).toLocaleDateString()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete resource?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{resource.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteResource.isPending}
            >
              {deleteResource.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
