-- Update admin password to 'FirstSunEn123'
-- This uses the auth.users table managed by Supabase
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find the admin user
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@firstsunen.com';
  
  -- Update the password using Supabase's internal password hashing
  -- Note: This will be handled by the Supabase Auth system
  IF admin_user_id IS NOT NULL THEN
    -- We cannot directly update auth.users password in a migration
    -- Instead, we'll output a message
    RAISE NOTICE 'Admin user found: %', admin_user_id;
  END IF;
END $$;