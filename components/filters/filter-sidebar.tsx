"use client"

import { useCategories } from "@/hooks/use-categories"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterSidebarProps {
  selectedTags: Record<string, string[]>
  onTagChange: (category: string, tag: string, checked: boolean) => void
  onClearFilters: () => void
}

export function FilterSidebar({
  selectedTags,
  onTagChange,
  onClearFilters,
}: FilterSidebarProps) {
  const { data: categories, isLoading } = useCategories()

  const hasActiveFilters = Object.values(selectedTags).some(
    (tags) => tags.length > 0
  )

  const activeFilterCount = Object.values(selectedTags).reduce(
    (acc, tags) => acc + tags.length,
    0
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No categories available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-auto py-1 px-2 text-xs"
          >
            Clear all
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>

      <Accordion type="multiple" className="w-full" defaultValue={categories.map((c) => c.id)}>
        {categories
          .filter((category) => category.type === "text")
          .map((category) => {
            const options = Array.isArray(category.options)
              ? category.options
              : []
            const selectedInCategory = selectedTags[category.name] || []

            return (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="text-sm">
                  <span className="flex items-center gap-2">
                    {category.name}
                    {selectedInCategory.length > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5">
                        {selectedInCategory.length}
                      </Badge>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {options.map((option) => {
                      const isChecked = selectedInCategory.includes(option)
                      return (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${category.name}-${option}`}
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              onTagChange(
                                category.name,
                                option,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`${category.name}-${option}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
      </Accordion>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(selectedTags).map(([category, tags]) =>
              tags.map((tag) => (
                <Badge
                  key={`${category}-${tag}`}
                  variant="secondary"
                  className="text-xs gap-1"
                >
                  {tag}
                  <button
                    onClick={() => onTagChange(category, tag, false)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
