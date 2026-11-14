export type TransactionType = 'cash_sale' | 'udhaar' | 'udhaar_payment';

export interface CashSale {
  id: string;
  amount: number;
  description: string;
  quantity?: number;
  unit?: string;
  category: 'chai' | 'snacks' | 'grocery' | 'cigarettes' | 'beverages' | 'other';
  paymentMode: 'cash' | 'upi';
  timestamp: string;
}

export interface CreditEntry {
  id: string;
  customerName: string;
  customerIdentifier?: string; // e.g. "4th street wale", "Nukkad pan shop", "Auto driver"
  phoneNumber?: string;
  amount: number;
  description: string;
  status: 'pending' | 'settled' | 'partial';
  partialPaidAmount?: number;
  timestamp: string;
  settledAt?: string;
  lastReminderSentAt?: string;
}

export interface CustomerSummary {
  name: string;
  identifier?: string;
  phoneNumber?: string;
  totalPending: number;
  totalSettled: number;
  lastTransactionDate: string;
  entriesCount: number;
}

export interface ParsedVoiceAction {
  type: TransactionType;
  amount: number;
  description: string;
  customerName?: string;
  customerIdentifier?: string;
  quantity?: number;
  unit?: string;
  category?: CashSale['category'];
  paymentMode?: 'cash' | 'upi';
}

export interface VoiceProcessResult {
  success: boolean;
  rawTranscript: string;
  detectedLanguage?: 'hindi' | 'hinglish' | 'english' | 'regional';
  actions: ParsedVoiceAction[];
  soundboxMessage: string; // The Hindi announcement string for the soundbox
  confidence?: number;
  error?: string;
}

export interface DailyClosingSummary {
  date: string;
  totalCashSales: number;
  totalUdhaarGiven: number;
  totalUdhaarRecovered: number;
  netCashInHand: number;
  totalPendingMarketCredit: number;
  cashTransactionsCount: number;
  udhaarTransactionsCount: number;
  topDebtors: { name: string; identifier?: string; amount: number }[];
  soundboxClosingSpeech: string;
}
