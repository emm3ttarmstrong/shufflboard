"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Header } from "@/components/layout/header"
import { CategoryCard } from "@/components/prompt-builder/category-card"
import { PromptPreview } from "@/components/prompt-builder/prompt-preview"
import { ShuffleButton } from "@/components/prompt-builder/shuffle-button"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_CATEGORIES, PROMPT_TEMPLATE } from "@/lib/constants"
import { RotateCcw } from "lucide-react"

interface User {
  email?: string | null
  name?: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [locked, setLocked] = useState<Record<string, boolean>>({})
  const [shufflingOptions, setShufflingOptions] = useState<
    Record<string, string | null>
  >({})
  const [isShufflingAll, setIsShufflingAll] = useState(false)
  const shuffleTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser({
          email: user.email,
          name: user.user_metadata?.name,
        })
      }
    }
    getUser()
  }, [supabase.auth])

  // Cleanup shuffle timeouts on unmount
  useEffect(() => {
    return () => {
      shuffleTimeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  const categories = DEFAULT_CATEGORIES

  const handleSelect = useCallback((category: string, option: string) => {
    setSelections((prev) => {
      if (prev[category] === option) {
        const { [category]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [category]: option }
    })
  }, [])

  const handleToggleLock = useCallback((category: string) => {
    setLocked((prev) => ({ ...prev, [category]: !prev[category] }))
  }, [])

  const shuffleCategory = useCallback(
    (categoryName: string): Promise<void> => {
      return new Promise((resolve) => {
        const category = categories.find((c) => c.name === categoryName)
        if (!category || category.options.length === 0) {
          resolve()
          return
        }

        const options = category.options
        const flickCount = 4
        let step = 0

        const flick = () => {
          const randomOption =
            options[Math.floor(Math.random() * options.length)]
          setShufflingOptions((prev) => ({
            ...prev,
            [categoryName]: randomOption,
          }))
          step++

          if (step < flickCount) {
            const timeout = setTimeout(flick, 80)
            shuffleTimeoutsRef.current.push(timeout)
          } else {
            // Final pick — try to avoid re-selecting the same option
            let finalOption = randomOption
            if (options.length > 1) {
              const currentSelection = selections[categoryName]
              const available = currentSelection
                ? options.filter((o) => o !== currentSelection)
                : options
              finalOption =
                available[Math.floor(Math.random() * available.length)]
            }

            setSelections((prev) => ({
              ...prev,
              [categoryName]: finalOption,
            }))
            setShufflingOptions((prev) => ({
              ...prev,
              [categoryName]: null,
            }))
            resolve()
          }
        }

        flick()
      })
    },
    [categories, selections]
  )

  const handleShuffle = useCallback(
    (categoryName: string) => {
      shuffleCategory(categoryName)
    },
    [shuffleCategory]
  )

  const handleShuffleAll = useCallback(async () => {
    setIsShufflingAll(true)

    const unlockedCategories = categories.filter((c) => !locked[c.name])

    // Stagger the shuffles with a small delay between each
    for (let i = 0; i < unlockedCategories.length; i++) {
      const category = unlockedCategories[i]
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          shuffleCategory(category.name).then(resolve)
        }, i * 120)
        shuffleTimeoutsRef.current.push(timeout)
      })
    }

    setIsShufflingAll(false)
  }, [categories, locked, shuffleCategory])

  const handleReset = useCallback(() => {
    setSelections({})
    setLocked({})
  }, [])

  const selectionCount = Object.keys(selections).length
  const prompt = PROMPT_TEMPLATE(selections)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <div className="container mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Design Prompt Builder</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select options or shuffle to create a unique design brief
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={selectionCount === 0}
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Reset
            </Button>
            <ShuffleButton
              onClick={handleShuffleAll}
              isShuffling={isShufflingAll}
              label="Shuffle All"
              size="sm"
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category cards */}
          <div className="flex-1 space-y-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                options={category.options}
                selected={selections[category.name] || null}
                locked={locked[category.name] || false}
                shufflingOption={shufflingOptions[category.name] || null}
                onSelect={(option) => handleSelect(category.name, option)}
                onShuffle={() => handleShuffle(category.name)}
                onToggleLock={() => handleToggleLock(category.name)}
              />
            ))}
          </div>

          {/* Prompt preview sidebar */}
          <aside className="lg:w-80 shrink-0">
            <PromptPreview
              prompt={prompt}
              selectionCount={selectionCount}
              totalCategories={categories.length}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
