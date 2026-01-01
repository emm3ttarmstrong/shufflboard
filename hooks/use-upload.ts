"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface UploadResult {
  url: string
  path: string
}

export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function upload(file: File): Promise<UploadResult | null> {
    setUploading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("screenshots")
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("screenshots").getPublicUrl(filePath)

      return {
        url: publicUrl,
        path: filePath,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed"
      setError(message)
      return null
    } finally {
      setUploading(false)
    }
  }

  async function uploadFromDataUrl(
    dataUrl: string,
    mimeType = "image/png"
  ): Promise<UploadResult | null> {
    // Convert data URL to blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    const extension = mimeType.split("/")[1] || "png"
    const file = new File([blob], `screenshot.${extension}`, { type: mimeType })

    return upload(file)
  }

  return {
    upload,
    uploadFromDataUrl,
    uploading,
    error,
  }
}
