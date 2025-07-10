-- Drop the duplicate and conflicting policies
DROP POLICY IF EXISTS "Allow authenticated users to upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to view their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile picture" ON storage.objects;

-- Create simplified policies that work with the file naming convention
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = split_part(name, '.', 1)
);

CREATE POLICY "Users can update their own profile pictures"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = split_part(name, '.', 1)
);

CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = split_part(name, '.', 1)
);