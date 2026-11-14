-- BahiKhaata Voice (बहीखाता आवाज़) PostgreSQL Schema for Supabase
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Sales Ledger Table (Cash & UPI Income)
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

-- 3. Credit Ledger Table (Udhaar Book)
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

-- 4. Daily Closing Summaries Table
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

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.sales_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_closing ENABLE ROW LEVEL SECURITY;

-- Anonymous/Public access policies for rapid local deployment
CREATE POLICY "Public anonymous read access on sales_ledger" ON public.sales_ledger FOR SELECT USING (true);
CREATE POLICY "Public anonymous insert access on sales_ledger" ON public.sales_ledger FOR INSERT WITH CHECK (true);
CREATE POLICY "Public anonymous update access on sales_ledger" ON public.sales_ledger FOR UPDATE USING (true);
CREATE POLICY "Public anonymous delete access on sales_ledger" ON public.sales_ledger FOR DELETE USING (true);

CREATE POLICY "Public anonymous read access on credit_ledger" ON public.credit_ledger FOR SELECT USING (true);
CREATE POLICY "Public anonymous insert access on credit_ledger" ON public.credit_ledger FOR INSERT WITH CHECK (true);
CREATE POLICY "Public anonymous update access on credit_ledger" ON public.credit_ledger FOR UPDATE USING (true);
CREATE POLICY "Public anonymous delete access on credit_ledger" ON public.credit_ledger FOR DELETE USING (true);

-- 6. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_ledger;
ALTER PUBLICATION supabase_realtime ADD TABLE public.credit_ledger;

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales_ledger(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_status ON public.credit_ledger(status);
CREATE INDEX IF NOT EXISTS idx_credit_customer ON public.credit_ledger(customer_name);
