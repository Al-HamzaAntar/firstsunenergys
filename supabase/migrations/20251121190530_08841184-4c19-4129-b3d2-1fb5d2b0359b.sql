-- Update RLS policies to allow editors to manage products and articles
DROP POLICY IF EXISTS "Only admins can modify main products" ON main_products;
CREATE POLICY "Admins and editors can modify main products"
ON main_products
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

DROP POLICY IF EXISTS "Admins can create articles" ON articles;
CREATE POLICY "Admins and editors can create articles"
ON articles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

DROP POLICY IF EXISTS "Admins can update articles" ON articles;
CREATE POLICY "Admins and editors can update articles"
ON articles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

DROP POLICY IF EXISTS "Admins can delete articles" ON articles;
CREATE POLICY "Admins and editors can delete articles"
ON articles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

DROP POLICY IF EXISTS "Admins can view all articles" ON articles;
CREATE POLICY "Admins and editors can view all articles"
ON articles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

DROP POLICY IF EXISTS "Only admins can modify gallery products" ON gallery_products;
CREATE POLICY "Admins and editors can modify gallery products"
ON gallery_products
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

DROP POLICY IF EXISTS "Only admins can modify partners" ON partners;
CREATE POLICY "Admins and editors can modify partners"
ON partners
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

DROP POLICY IF EXISTS "Only admins can modify translations" ON translations;
CREATE POLICY "Admins and editors can modify translations"
ON translations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

DROP POLICY IF EXISTS "Only admins can modify site content" ON site_content;
CREATE POLICY "Admins and editors can modify site content"
ON site_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));