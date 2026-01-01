export interface Resource {
  id: string
  user_id: string
  title: string
  url: string | null
  screenshot: string | null
  embed_code: string | null
  embed_type: "twitter" | null
  notes: string | null
  tags: Record<string, string[]>
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  type: "text" | "color"
  options: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string | null
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface ResourcesResponse {
  items: Resource[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CreateResourceInput {
  title: string
  url?: string
  screenshot?: string
  embed_code?: string
  embed_type?: "twitter"
  notes?: string
  tags?: Record<string, string[]>
}

export interface UpdateResourceInput {
  title?: string
  url?: string
  screenshot?: string
  embed_code?: string
  embed_type?: "twitter" | null
  notes?: string
  tags?: Record<string, string[]>
}

export type CategoriesMap = Record<
  string,
  {
    type: "text" | "color"
    options: string[]
  }
>
