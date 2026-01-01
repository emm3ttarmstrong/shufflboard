"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  Resource,
  ResourcesResponse,
  CreateResourceInput,
  UpdateResourceInput,
} from "@/types"

interface UseResourcesParams {
  search?: string
  page?: number
  limit?: number
  tags?: Record<string, string[]>
}

export function useResources(params: UseResourcesParams = {}) {
  const { search = "", page = 1, limit = 20, tags } = params

  return useQuery<ResourcesResponse>({
    queryKey: ["resources", { search, page, limit, tags }],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })

      if (search) {
        searchParams.set("search", search)
      }

      if (tags && Object.keys(tags).length > 0) {
        searchParams.set("tags", JSON.stringify(tags))
      }

      const response = await fetch(`/api/resources?${searchParams}`)

      if (!response.ok) {
        throw new Error("Failed to fetch resources")
      }

      return response.json()
    },
  })
}

export function useResource(id: string) {
  return useQuery<Resource>({
    queryKey: ["resource", id],
    queryFn: async () => {
      const response = await fetch(`/api/resources/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch resource")
      }

      return response.json()
    },
    enabled: !!id,
  })
}

export function useCreateResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateResourceInput) => {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create resource")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] })
    },
  })
}

export function useUpdateResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: UpdateResourceInput & { id: string }) => {
      const response = await fetch(`/api/resources/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update resource")
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["resources"] })
      queryClient.invalidateQueries({ queryKey: ["resource", data.id] })
    },
  })
}

export function useDeleteResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/resources/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete resource")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] })
    },
  })
}
