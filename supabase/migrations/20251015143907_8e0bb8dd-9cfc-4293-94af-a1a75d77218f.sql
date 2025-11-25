-- Add admin role to Admin@FirstSunEn.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('ded93cf7-1574-498b-b3ec-0b5524ad7efb', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;