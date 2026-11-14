import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CashSale, CreditEntry } from '@/types/ledger';
import { initialCashSales, initialCreditEntries } from './sampleData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local Storage Keys for Offline-First resilience
const CASH_SALES_KEY = 'bahikhaata_cash_sales';
const CREDIT_LEDGER_KEY = 'bahikhaata_credit_ledger';

export function getLocalCashSales(): CashSale[] {
  if (typeof window === 'undefined') return initialCashSales;
  try {
    const data = localStorage.getItem(CASH_SALES_KEY);
    if (!data) {
      localStorage.setItem(CASH_SALES_KEY, JSON.stringify(initialCashSales));
      return initialCashSales;
    }
    return JSON.parse(data);
  } catch {
    return initialCashSales;
  }
}

export function saveLocalCashSales(sales: CashSale[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CASH_SALES_KEY, JSON.stringify(sales));
    window.dispatchEvent(new Event('bahikhaata_data_changed'));
  }
}

export function getLocalCreditEntries(): CreditEntry[] {
  if (typeof window === 'undefined') return initialCreditEntries;
  try {
    const data = localStorage.getItem(CREDIT_LEDGER_KEY);
    if (!data) {
      localStorage.setItem(CREDIT_LEDGER_KEY, JSON.stringify(initialCreditEntries));
      return initialCreditEntries;
    }
    return JSON.parse(data);
  } catch {
    return initialCreditEntries;
  }
}

export function saveLocalCreditEntries(credits: CreditEntry[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CREDIT_LEDGER_KEY, JSON.stringify(credits));
    window.dispatchEvent(new Event('bahikhaata_data_changed'));
  }
}

// Database sync helper
export async function syncCashSaleToDb(sale: CashSale): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('sales_ledger').insert([
      {
        id: sale.id,
        amount: sale.amount,
        description: sale.description,
        quantity: sale.quantity,
        unit: sale.unit,
        category: sale.category,
        payment_mode: sale.paymentMode,
        created_at: sale.timestamp,
      },
    ]);
    return !error;
  } catch {
    return false;
  }
}

export async function syncCreditEntryToDb(entry: CreditEntry): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('credit_ledger').insert([
      {
        id: entry.id,
        customer_name: entry.customerName,
        customer_identifier: entry.customerIdentifier,
        phone_number: entry.phoneNumber,
        amount: entry.amount,
        description: entry.description,
        status: entry.status,
        created_at: entry.timestamp,
        settled_at: entry.settledAt,
      },
    ]);
    return !error;
  } catch {
    return false;
  }
}
