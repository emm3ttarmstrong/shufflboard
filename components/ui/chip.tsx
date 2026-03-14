"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 border cursor-pointer select-none",
          selected
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-background text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Chip.displayName = "Chip"

export { Chip }
