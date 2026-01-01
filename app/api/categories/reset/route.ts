import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Delete user's custom categories to fall back to defaults
  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("user_id", user.id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  // Fetch and return default categories
  const { data: defaultCategories, error: fetchError } = await supabase
    .from("categories")
    .select("*")
    .is("user_id", null)
    .order("sort_order", { ascending: true })

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json(defaultCategories || [])
}
