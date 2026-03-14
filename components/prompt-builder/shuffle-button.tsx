"use client"

import { Dices } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ShuffleButtonProps {
  onClick: () => void
  isShuffling?: boolean
  size?: "sm" | "default" | "lg"
  label?: string
  className?: string
}

export function ShuffleButton({
  onClick,
  isShuffling = false,
  size = "default",
  label,
  className,
}: ShuffleButtonProps) {
  return (
    <Button
      variant={label ? "default" : "ghost"}
      size={label ? size : "icon"}
      onClick={onClick}
      disabled={isShuffling}
      className={cn(
        "transition-transform",
        isShuffling && "animate-spin",
        className
      )}
    >
      <Dices className={cn(label ? "mr-2 h-4 w-4" : "h-4 w-4")} />
      {label && <span>{label}</span>}
    </Button>
  )
}
