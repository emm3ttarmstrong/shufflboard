import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { CreateResourceInput } from "@/types"

export async function GET(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page")) || 1
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100)
  const tags = searchParams.get("tags") // JSON string of tag filters
  const offset = (page - 1) * limit

  let query = supabase
    .from("resources")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  // Search filter
  if (search) {
    query = query.or(`title.ilike.%${search}%,notes.ilike.%${search}%`)
  }

  // Tag filtering (if provided)
  if (tags) {
    try {
      const tagFilters = JSON.parse(tags) as Record<string, string[]>
      for (const [category, selectedTags] of Object.entries(tagFilters)) {
        if (selectedTags.length > 0) {
          // Filter resources that have any of the selected tags for this category
          query = query.contains("tags", { [category]: selectedTags })
        }
      }
    } catch {
      // Invalid JSON, ignore tag filter
    }
  }

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    items: data,
    page,
    limit,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: CreateResourceInput
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { title, url, screenshot, embed_code, embed_type, notes, tags } = body

  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("resources")
    .insert({
      user_id: user.id,
      title: title.trim(),
      url: url || null,
      screenshot: screenshot || null,
      embed_code: embed_code || null,
      embed_type: embed_type || null,
      notes: notes || null,
      tags: tags || {},
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
