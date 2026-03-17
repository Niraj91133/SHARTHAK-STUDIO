-- ========================================================
-- 🚀 THE GUARANTEED SUPABASE FIX (V2)
-- Run this in your Supabase SQL Editor.
-- ========================================================

-- 1. FIX SCHEMA PERMISSIONS (The "Permission Denied" Fix)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON SCHEMA public TO anon, authenticated;

-- 2. SETUP TABLE
CREATE TABLE IF NOT EXISTS public.media_slots (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  frame TEXT NOT NULL,
  type TEXT NOT NULL,
  use_on_site BOOLEAN DEFAULT false,
  uploaded_file_name TEXT,
  uploaded_file_url TEXT,
  uploaded_file_size BIGINT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. OPEN TABLE PERMISSIONS
GRANT ALL ON TABLE public.media_slots TO anon, authenticated, service_role;
ALTER TABLE public.media_slots DISABLE ROW LEVEL SECURITY;

-- 4. SETUP STORAGE BUCKET
-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('SHARTHAK_STUDIO', 'SHARTHAK_STUDIO', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. STORAGE POLICIES (The Clean Way)
-- We drop policies by name instead of deleting from internal tables.

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow Everything" ON storage.objects;

-- Create New All-Access Policy
CREATE POLICY "Allow Everything" 
ON storage.objects FOR ALL 
TO public, anon, authenticated 
USING (bucket_id = 'SHARTHAK_STUDIO') 
WITH CHECK (bucket_id = 'SHARTHAK_STUDIO');
