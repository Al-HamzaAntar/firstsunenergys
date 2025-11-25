-- Add media_type column to articles table to support both images and videos
ALTER TABLE articles 
ADD COLUMN media_type text DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- Add comment to clarify that image_url can contain video URLs too
COMMENT ON COLUMN articles.image_url IS 'URL for media content (image or video based on media_type)';
