-- Assign designer role to all existing users who don't have any role yet
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'designer'::app_role
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id
)
ON CONFLICT (user_id, role) DO NOTHING;