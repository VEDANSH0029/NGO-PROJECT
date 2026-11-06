-- ====================================================================
-- MIGRATION 004: INDEXES AND PERFORMANCE OPTIMIZATION
-- ====================================================================

-- 1. Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Events indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);

-- 3. Volunteers indexes
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON public.volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON public.volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON public.volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON public.volunteers(created_at DESC);

-- 4. Donations indexes
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON public.donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);

-- 5. Event Registrations indexes
CREATE INDEX IF NOT EXISTS idx_event_reg_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_event_id ON public.event_registrations(event_id);

-- 6. Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 7. Admin Logs indexes
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

