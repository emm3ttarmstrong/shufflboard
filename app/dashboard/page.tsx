"use client"

import { useState, useCallback, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { SearchBar } from "@/components/filters/search-bar"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { ResourceGrid } from "@/components/resources/resource-grid"
import { AddResourceModal } from "@/components/resources/add-resource-modal"
import { useResources } from "@/hooks/use-resources"
import { createClient } from "@/lib/supabase/client"

interface User {
  email?: string | null
  name?: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({})

  const supabase = createClient()

  // Fetch user
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

  const { data, isLoading } = useResources({
    search,
    page,
    limit: 20,
    tags: Object.keys(selectedTags).length > 0 ? selectedTags : undefined,
  })

  const handleTagChange = useCallback(
    (category: string, tag: string, checked: boolean) => {
      setSelectedTags((prev) => {
        const current = prev[category] || []
        if (checked) {
          return { ...prev, [category]: [...current, tag] }
        } else {
          const updated = current.filter((t) => t !== tag)
          if (updated.length === 0) {
            const { [category]: _, ...rest } = prev
            return rest
          }
          return { ...prev, [category]: updated }
        }
      })
      setPage(1) // Reset to first page when filtering
    },
    []
  )

  const handleClearFilters = useCallback(() => {
    setSelectedTags({})
    setPage(1)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
          <AddResourceModal />
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-lg border p-4 sticky top-4">
              <FilterSidebar
                selectedTags={selectedTags}
                onTagChange={handleTagChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            <ResourceGrid
              resources={data?.items || []}
              isLoading={isLoading}
              page={page}
              totalPages={data?.totalPages || 1}
              onPageChange={setPage}
            />
          </main>
        </div>
      </div>
    </div>
  )
}
