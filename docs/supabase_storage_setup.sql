-- SUPABASE STORAGE SETUP FOR PUZZLE PHOTOS
-- Run these commands in your Supabase SQL Editor

-- Create storage buckets for puzzle photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('puzzle-photos', 'puzzle-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for puzzle-photos bucket
CREATE POLICY "Anyone can view puzzle photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'puzzle-photos');

CREATE POLICY "Authenticated users can upload puzzle photos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'puzzle-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own puzzle photos" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'puzzle-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own puzzle photos" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'puzzle-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up RLS policies for profile-photos bucket
CREATE POLICY "Anyone can view profile photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can upload profile photos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own profile photos" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile photos" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
); 