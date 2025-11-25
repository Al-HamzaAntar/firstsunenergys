-- Remove admin role from hamzaantar2001@gmail.com
DELETE FROM public.user_roles 
WHERE user_id = 'cfbde809-87dc-4ed9-b252-e721fc841d95' AND role = 'admin';