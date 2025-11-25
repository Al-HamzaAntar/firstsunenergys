-- Fix user_roles table RLS policies to prevent unauthenticated access
-- This addresses the critical security finding: user_roles_table_exposure

-- Drop existing policy
DROP POLICY IF EXISTS "Only admins can manage user roles" ON public.user_roles;

-- Policy 1: Admins can do everything (INSERT, UPDATE, DELETE, SELECT)
CREATE POLICY "Admins can manage all user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy 2: Authenticated users can view ONLY their own roles
-- This allows the application to check user permissions without exposing other users' roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Note: With RLS enabled and these policies in place, unauthenticated users 
-- will have NO access to the table, preventing enumeration of admin accounts