-- ==============================================================================
-- BahiKhaata Voice (बहीखाता आवाज़) Production Database Schema for Supabase
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Synced automatically from Google OAuth & Auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    shop_name TEXT DEFAULT 'मेरी दुकान (My Shop)',
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Sales Ledger Table (Cash & UPI Income)
CREATE TABLE IF NOT EXISTS public.sales_ledger (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit TEXT,
    category TEXT DEFAULT 'other' CHECK (category IN ('chai', 'snacks', 'grocery', 'cigarettes', 'beverages', 'other')),
    payment_mode TEXT DEFAULT 'cash' CHECK (payment_mode IN ('cash', 'upi')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Credit Ledger Table (Udhaar Book)
CREATE TABLE IF NOT EXISTS public.credit_ledger (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_identifier TEXT, -- e.g. "4th street wale", "auto stand", "nukkad"
    phone_number TEXT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'partial')),
    partial_paid_amount NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    settled_at TIMESTAMP WITH TIME ZONE,
    last_reminder_sent_at TIMESTAMP WITH TIME ZONE
);

-- 5. Daily Closing Summaries Table
CREATE TABLE IF NOT EXISTS public.daily_closing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    closing_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_cash_sales NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_udhaar_given NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_udhaar_recovered NUMERIC(10, 2) NOT NULL DEFAULT 0,
    net_cash_in_hand NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_pending_market_credit NUMERIC(10, 2) NOT NULL DEFAULT 0,
    closed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_closing ENABLE ROW LEVEL SECURITY;

-- 7. Multi-Tenant RLS Policies (Allows logged in Google/Email users OR guest users)
-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Sales Ledger Policies
DROP POLICY IF EXISTS "Allow users and guests to select sales" ON public.sales_ledger;
CREATE POLICY "Allow users and guests to select sales" ON public.sales_ledger
    FOR SELECT USING (auth.uid() = vendor_id OR vendor_id IS NULL);

DROP POLICY IF EXISTS "Allow users and guests to insert sales" ON public.sales_ledger;
CREATE POLICY "Allow users and guests to insert sales" ON public.sales_ledger
    FOR INSERT WITH CHECK (auth.uid() = vendor_id OR vendor_id IS NULL);

DROP POLICY IF EXISTS "Allow users and guests to update sales" ON public.sales_ledger;
CREATE POLICY "Allow users and guests to update sales" ON public.sales_ledger
    FOR UPDATE USING (auth.uid() = vendor_id OR vendor_id IS NULL);

DROP POLICY IF EXISTS "Allow users and guests to delete sales" ON public.sales_ledger;
CREATE POLICY "Allow users and guests to delete sales" ON public.sales_ledger
    FOR DELETE USING (auth.uid() = vendor_id OR vendor_id IS NULL);

-- Credit Ledger Policies
DROP POLICY IF EXISTS "Allow users and guests to select credit" ON public.credit_ledger;
CREATE POLICY "Allow users and guests to select credit" ON public.credit_ledger
    FOR SELECT USING (auth.uid() = vendor_id OR vendor_id IS NULL);

DROP POLICY IF EXISTS "Allow users and guests to insert credit" ON public.credit_ledger;
CREATE POLICY "Allow users and guests to insert credit" ON public.credit_ledger
    FOR INSERT WITH CHECK (auth.uid() = vendor_id OR vendor_id IS NULL);

DROP POLICY IF EXISTS "Allow users and guests to update credit" ON public.credit_ledger;
CREATE POLICY "Allow users and guests to update credit" ON public.credit_ledger
    FOR UPDATE USING (auth.uid() = vendor_id OR vendor_id IS NULL);

DROP POLICY IF EXISTS "Allow users and guests to delete credit" ON public.credit_ledger;
CREATE POLICY "Allow users and guests to delete credit" ON public.credit_ledger
    FOR DELETE USING (auth.uid() = vendor_id OR vendor_id IS NULL);

-- 8. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_ledger;
ALTER PUBLICATION supabase_realtime ADD TABLE public.credit_ledger;

-- 9. Lightning Performance Indexes
CREATE INDEX IF NOT EXISTS idx_sales_vendor ON public.sales_ledger(vendor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_vendor ON public.credit_ledger(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_credit_customer ON public.credit_ledger(customer_name);

-- 10. Automatic Profile Creation Trigger on Google OAuth / Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'दुकानदार'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
