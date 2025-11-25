-- Drop old columns and add new multilingual columns to main_products
ALTER TABLE main_products 
  DROP COLUMN IF EXISTS title_key,
  DROP COLUMN IF EXISTS description_key,
  DROP COLUMN IF EXISTS badge_key;

ALTER TABLE main_products
  ADD COLUMN name_en TEXT NOT NULL DEFAULT '',
  ADD COLUMN name_ar TEXT NOT NULL DEFAULT '',
  ADD COLUMN description_en TEXT NOT NULL DEFAULT '',
  ADD COLUMN description_ar TEXT NOT NULL DEFAULT '',
  ADD COLUMN badge_en TEXT,
  ADD COLUMN badge_ar TEXT;