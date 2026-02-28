"use client"

import { Lock, Unlock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { ShuffleButton } from "./shuffle-button"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  name: string
  options: string[]
  selected: string | null
  locked: boolean
  shufflingOption: string | null
  onSelect: (option: string) => void
  onShuffle: () => void
  onToggleLock: () => void
}

export function CategoryCard({
  name,
  options,
  selected,
  locked,
  shufflingOption,
  onSelect,
  onShuffle,
  onToggleLock,
}: CategoryCardProps) {
  return (
    <Card className={cn("transition-all", locked && "ring-2 ring-primary/20")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-5 pt-4">
        <CardTitle className="text-base font-semibold">{name}</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleLock}
            title={locked ? "Unlock category" : "Lock category"}
          >
            {locked ? (
              <Lock className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Unlock className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
          <ShuffleButton
            onClick={onShuffle}
            isShuffling={!!shufflingOption}
            size="sm"
            className="h-8 w-8"
          />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Chip
              key={option}
              selected={selected === option}
              onClick={() => onSelect(option)}
              className={cn(
                shufflingOption === option &&
                  "ring-2 ring-primary/50 scale-105"
              )}
            >
              {option}
            </Chip>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
