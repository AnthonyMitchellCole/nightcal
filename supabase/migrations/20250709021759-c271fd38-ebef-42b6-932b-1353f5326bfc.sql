-- Create branding storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true);

-- Create policies for branding bucket (public read access)
CREATE POLICY "Branding files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'branding');

CREATE POLICY "Authenticated users can upload branding files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'branding' AND auth.role() = 'authenticated');