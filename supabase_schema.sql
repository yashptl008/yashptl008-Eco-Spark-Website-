-- Run this SQL in your Supabase SQL Editor to set up the database schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
DROP POLICY IF EXISTS "Allow public read-only profiles" ON public.profiles;
CREATE POLICY "Allow public read-only profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  specs JSONB DEFAULT '[]',        -- [{ "label": "Voltage", "value": "12V" }, ...]
  features TEXT[] DEFAULT '{}',
  applications TEXT[] DEFAULT '{}',
  warranty TEXT,
  images TEXT[] DEFAULT '{}',      -- Supabase Storage URLs
  brochure_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products RLS policies
DROP POLICY IF EXISTS "Allow public read for active products" ON public.products;
CREATE POLICY "Allow public read for active products" ON public.products FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Allow admin full control on products" ON public.products;
CREATE POLICY "Allow admin full control on products" ON public.products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  source_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Leads RLS policies
DROP POLICY IF EXISTS "Allow public write access to leads" ON public.leads;
CREATE POLICY "Allow public write access to leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read access to leads" ON public.leads;
CREATE POLICY "Allow admin read access to leads" ON public.leads FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'product_view', 'whatsapp_click')),
  product_id UUID REFERENCES public.products(id),
  page_path TEXT,
  user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics Events RLS policies
DROP POLICY IF EXISTS "Allow public write access to analytics" ON public.analytics_events;
CREATE POLICY "Allow public write access to analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read access to analytics" ON public.analytics_events;
CREATE POLICY "Allow admin read access to analytics" ON public.analytics_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
