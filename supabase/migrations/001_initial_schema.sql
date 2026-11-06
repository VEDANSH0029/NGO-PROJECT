-- ====================================================================
-- MIGRATION 001: INITIAL SCHEMA FOR HOPECONNECT NGO
-- ====================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'volunteer' CHECK (role IN ('volunteer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Helper Function: Check Admin Status securely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'),
    false
  );
END;
$$;

-- 3. Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_app_meta_data ->> 'role', 'volunteer')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  place TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed initial default events if empty
INSERT INTO public.events (title, date, place, description, status)
SELECT 'Tree Plantation Drive', '15 November 2026', 'Community Park', 'Plant trees with other volunteers.', 'Upcoming'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Tree Plantation Drive');

INSERT INTO public.events (title, date, place, description, status)
SELECT 'Education Awareness Camp', '22 November 2026', 'Community Centre', 'Help students with learning activities.', 'Upcoming'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Education Awareness Camp');

INSERT INTO public.events (title, date, place, description, status)
SELECT 'Health Awareness Program', '5 December 2026', 'Public Hall', 'Share information about health and hygiene.', 'Upcoming'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Health Awareness Program');

-- 5. Volunteers Table
CREATE TABLE IF NOT EXISTS public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 16 AND age <= 100),
  city VARCHAR(100) NOT NULL,
  interest VARCHAR(100) NOT NULL,
  skills TEXT NOT NULL,
  availability VARCHAR(50) NOT NULL,
  experience VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL CHECK (char_length(reason) >= 30),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Donations Table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name VARCHAR(100) NOT NULL,
  donor_email VARCHAR(150) NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 1),
  payment_method VARCHAR(80) NOT NULL,
  payment_status TEXT DEFAULT 'Pledge Recorded' CHECK (payment_status IN ('Pledge Recorded', 'Verified Paid', 'Cancelled', 'Refunded')),
  transaction_reference TEXT,
  donor_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Event Registrations Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_status TEXT DEFAULT 'Registered' CHECK (registration_status IN ('Registered', 'Attended', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_event_registration UNIQUE (event_id, user_id)
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Admin Logs Table (Audit trail)
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);
