-- Create storage bucket for article media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('articles', 'articles', true);

-- Allow anyone to view article media
CREATE POLICY "Anyone can view article media"
ON storage.objects FOR SELECT
USING (bucket_id = 'articles');

-- Allow admins to upload article media
CREATE POLICY "Admins can upload article media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'articles' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update article media
CREATE POLICY "Admins can update article media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'articles' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete article media
CREATE POLICY "Admins can delete article media"
ON storage.objects FOR DELETE
USING (bucket_id = 'articles' AND has_role(auth.uid(), 'admin'::app_role));