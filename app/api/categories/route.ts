import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Category } from "@/types"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // First try to get user's custom categories
  const { data: userCategories, error: userError } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // If user has custom categories, return those
  if (userCategories && userCategories.length > 0) {
    return NextResponse.json(userCategories)
  }

  // Otherwise, return default categories (user_id IS NULL)
  const { data: defaultCategories, error: defaultError } = await supabase
    .from("categories")
    .select("*")
    .is("user_id", null)
    .order("sort_order", { ascending: true })

  if (defaultError) {
    return NextResponse.json({ error: defaultError.message }, { status: 500 })
  }

  return NextResponse.json(defaultCategories || [])
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let categories: Partial<Category>[]
  try {
    categories = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!Array.isArray(categories)) {
    return NextResponse.json(
      { error: "Categories must be an array" },
      { status: 400 }
    )
  }

  // Delete user's existing categories
  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("user_id", user.id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  // Insert new categories
  const categoriesToInsert = categories.map((cat, index) => ({
    user_id: user.id,
    name: cat.name,
    type: cat.type || "text",
    options: cat.options || [],
    sort_order: index,
  }))

  const { data, error: insertError } = await supabase
    .from("categories")
    .insert(categoriesToInsert)
    .select()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
