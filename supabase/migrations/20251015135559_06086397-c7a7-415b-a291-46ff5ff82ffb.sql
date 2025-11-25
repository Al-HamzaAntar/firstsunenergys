-- Fix 1: Remove the policy that allows users to view their own roles
-- This prevents potential enumeration attacks on the user_roles table
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Fix 2: Update the update_updated_at_column function with fixed search_path
-- This prevents search path manipulation attacks
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Ensure has_role function has proper search_path (it already does, but let's be explicit)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;