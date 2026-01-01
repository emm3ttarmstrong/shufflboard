-- Shufflboard Storage Setup
-- Run this AFTER the initial schema in your Supabase SQL Editor

-- ============================================
-- STORAGE BUCKET
-- ============================================

-- Create the screenshots bucket (if it doesn't exist)
-- Note: You may need to create this via the Supabase Dashboard instead
-- Go to Storage > New Bucket > Name: "screenshots" > Public: checked

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload screenshots"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'screenshots' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to all screenshots
CREATE POLICY "Public can read screenshots"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'screenshots');

-- Allow users to update their own screenshots
CREATE POLICY "Users can update own screenshots"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'screenshots' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own screenshots
CREATE POLICY "Users can delete own screenshots"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'screenshots' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
