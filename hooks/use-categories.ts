"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Category } from "@/types"

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories")

      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      return response.json()
    },
  })
}

export function useUpdateCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categories: Partial<Category>[]) => {
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categories),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update categories")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useResetCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/categories/reset", {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to reset categories")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
