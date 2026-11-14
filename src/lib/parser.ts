import { ParsedVoiceAction, VoiceProcessResult } from '@/types/ledger';

// Map Hindi number words to integers
const hindiNumbers: Record<string, number> = {
  'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5, 'panch': 5,
  'chhe': 6, 'saat': 7, 'aath': 8, 'nau': 9, 'das': 10, 'dus': 10,
  'gyarah': 11, 'barah': 12, 'terah': 13, 'chaudah': 14, 'pandrah': 15,
  'solah': 16, 'satrah': 17, 'atharah': 18, 'unnis': 19, 'bees': 20,
  'tees': 30, 'chalis': 40, 'pachaas': 50, 'pachas': 50,
  'saath': 60, 'sattar': 70, 'assi': 80, 'nabbe': 90,
  'sau': 100, 'ek sau': 100, 'derh sau': 150, 'dedh sau': 150,
  'do sau': 200, 'teen sau': 300, 'char sau': 400, 'paanch sau': 500,
  'hazaar': 1000, 'hazar': 1000,
};

function normalizeHindiNumbers(text: string): string {
  let res = text;
  // Replace word-numbers while avoiding ordinal words
  for (const [word, num] of Object.entries(hindiNumbers)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    res = res.replace(regex, num.toString());
  }
  return res;
}

function detectCategory(text: string): 'chai' | 'snacks' | 'grocery' | 'cigarettes' | 'beverages' | 'other' {
  const lower = text.toLowerCase();
  if (lower.includes('chai') || lower.includes('tea') || lower.includes('cutting')) return 'chai';
  if (lower.includes('samosa') || lower.includes('bun') || lower.includes('maska') || lower.includes('kachori') || lower.includes('pakode') || lower.includes('biscuit') || lower.includes('toast') || lower.includes('chips')) return 'snacks';
  if (lower.includes('bidi') || lower.includes('beedi') || lower.includes('cigarette') || lower.includes('pan') || lower.includes('gutkha')) return 'cigarettes';
  if (lower.includes('cold drink') || lower.includes('pani') || lower.includes('water') || lower.includes('pepsi') || lower.includes('frooti') || lower.includes('coke') || lower.includes('lassi')) return 'beverages';
  if (lower.includes('atta') || lower.includes('dal') || lower.includes('chini') || lower.includes('tel') || lower.includes('oil') || lower.includes('soap')) return 'grocery';
  return 'other';
}

/**
 * Extracts the monetary transaction amount from a spoken clause.
 * Distinguishes price/amount from item quantities (e.g. "2 chai 20 rupaye" -> amount = 20, qty = 2).
 * Ignores street numbers / ordinals like "4th street".
 */
function extractAmountAndQuantity(clause: string): { amount: number; quantity: number } {
  // 1. Look for explicit currency indicators: "20 rupaye", "₹20", "20 rs"
  const explicitCurrencyMatch = clause.match(/(\d+)\s*(?:rupaye|rupee|rupya|rs|₹|\/-)/i);
  if (explicitCurrencyMatch) {
    const amt = parseInt(explicitCurrencyMatch[1], 10);
    // Find quantity (e.g., "2 chai")
    const qtyMatch = clause.match(/\b(\d+)\s*(?:cup|plate|chai|samosa|bidi|pack|packet|bun|cigarette|chips)?\b/i);
    let qty = 1;
    if (qtyMatch && parseInt(qtyMatch[1], 10) !== amt) {
      qty = parseInt(qtyMatch[1], 10);
    }
    return { amount: amt, quantity: qty > 0 && qty < 100 ? qty : 1 };
  }

  // 2. Look for financial context: "40 ka udhaar", "50 cash", "100 jama"
  const contextMatch = clause.match(/(\d+)\s*(?:ka|ki|ke)?\s*(?:udhaar|baki|cash|nagad|jama|chukaya|wapas)/i);
  if (contextMatch) {
    return { amount: parseInt(contextMatch[1], 10), quantity: 1 };
  }

  // 3. Fallback: extract standalone numbers (excluding ordinals like 4th)
  const numbers: number[] = [];
  const numRegex = /\b(\d+)(?!(?:st|nd|rd|th))\b/gi;
  let match;
  while ((match = numRegex.exec(clause)) !== null) {
    numbers.push(parseInt(match[1], 10));
  }

  if (numbers.length === 1) {
    return { amount: numbers[0], quantity: 1 };
  } else if (numbers.length >= 2) {
    // Usually the larger number is the amount (e.g., 2 chai for 20)
    const sorted = [...numbers].sort((a, b) => b - a);
    return { amount: sorted[0], quantity: sorted[1] };
  }

  return { amount: 0, quantity: 1 };
}

/**
 * Intelligent deterministic parser for Hindi / Hinglish shopkeeper voice notes.
 * Splits compound sentences into separate cash sales and udhaar entries.
 */
export function parseVoiceIntentLocally(rawText: string): VoiceProcessResult {
  const cleanInput = rawText.trim();
  if (!cleanInput) {
    return {
      success: false,
      rawTranscript: '',
      actions: [],
      soundboxMessage: 'कोई आवाज़ सुनाई नहीं दी। कृपया फिर से बोलें।',
      error: 'Empty voice input',
    };
  }

  // Pre-normalize Hindi spoken numbers
  const normalized = normalizeHindiNumbers(cleanInput);

  // Split compound clauses by "aur", "and", "or", ",", "phir", "sath me"
  const clauses = normalized
    .split(/\s+(?:aur|and|phir|saath\s+mein|tatha|,|\+)\s+/i)
    .map(c => c.trim())
    .filter(Boolean);

  const parsedActions: ParsedVoiceAction[] = [];

  for (const clause of clauses) {
    // 1. Check for settlement / payment of existing credit (udhaar wapas/jama)
    const isPayment = /\b(?:wapas|jama|chukaya|lautaya|paid|de\s+diya|diye)\b/i.test(clause) &&
                      !/\b(?:udhaar\s+diya|baki\s+rakha)\b/i.test(clause);

    // 2. Check for credit (udhaar / baki / khata)
    const isUdhaar = /\b(?:udhaar|baki|baaki|khata|likh\s+lo|likho|likh\s+dena|credit|ke\s+naam)\b/i.test(clause) && !isPayment;

    const { amount, quantity } = extractAmountAndQuantity(clause);

    if (isPayment) {
      // Extract customer name
      const nameMatch = clause.match(/(?:ne\s+|ka\s+)?([A-Za-z\u0900-\u097F]+(?:\s+ji|\s+bhai)?)\s*(?:ne|\s+ne|\s+ka)?/i);
      let customerName = 'Grahak';
      if (nameMatch) {
        customerName = nameMatch[1].replace(/\b(?:ne|ka|se|ko|jama|rupaye|\d+)\b/gi, '').trim() || 'Grahak';
      }

      parsedActions.push({
        type: 'udhaar_payment',
        amount: amount || 50,
        customerName: customerName,
        description: 'उधार जमा (Credit Repaid)',
        paymentMode: 'cash',
      });
      continue;
    }

    if (isUdhaar) {
      let customerName = 'Grahak';
      let customerIdentifier = '';

      // Check for location tag like "...wale", "...shop", "...stand"
      const locMatch = clause.match(/([a-zA-Z0-9\s]+(?:wale|stand|nukkad|shop|market))/i);
      if (locMatch) {
        customerIdentifier = locMatch[1].trim();
      }

      // Check for customer name before "ka", "ko", "ke naam"
      // E.g., "4th street wale Ramesh ka" -> Name is Ramesh
      const nameKaMatch = clause.match(/(?:wale|stand|nukkad)?\s*([A-Za-z\u0900-\u097F]+(?:\s+ji|\s+bhai)?)\s+(?:ka|ko|ke\s+naam)/i);
      if (nameKaMatch) {
        customerName = nameKaMatch[1].replace(/\b(?:wale|street|stand|ka|ko)\b/gi, '').trim();
      } else {
        // Fallback: look for capitalized or non-keyword word
        const words = clause
          .replace(/([a-zA-Z0-9\s]+(?:wale|stand|nukkad))/gi, '')
          .replace(/\b(?:udhaar|likh\s+lo|likho|likh\s+dena|rupaye|rs|\d+|ka|ki|ke)\b/gi, '')
          .trim()
          .split(/\s+/);
        if (words.length > 0 && words[0].length > 1) {
          customerName = words[0];
        }
      }

      parsedActions.push({
        type: 'udhaar',
        amount: amount || 40,
        customerName: customerName.charAt(0).toUpperCase() + customerName.slice(1),
        customerIdentifier: customerIdentifier || undefined,
        description: 'उधार खाता दर्ज',
      });
      continue;
    }

    // Default: Cash Sale
    const category = detectCategory(clause);
    const cleanDesc = clause
      .replace(/\b(?:bechi|bika|cash|nagad|aaya|mila|rupaye|rs|\d+)\b/gi, '')
      .replace(/[^\w\s\u0900-\u097F]/gi, '')
      .trim();

    parsedActions.push({
      type: 'cash_sale',
      amount: amount || 20,
      description: cleanDesc ? cleanDesc.charAt(0).toUpperCase() + cleanDesc.slice(1) : `${category.toUpperCase()} बिक्री`,
      quantity: quantity,
      category: category,
      paymentMode: clause.toLowerCase().includes('upi') || clause.toLowerCase().includes('online') ? 'upi' : 'cash',
    });
  }

  // Fallback if empty
  if (parsedActions.length === 0) {
    parsedActions.push({
      type: 'cash_sale',
      amount: 20,
      description: cleanInput,
      category: detectCategory(cleanInput),
      paymentMode: 'cash',
    });
  }

  // Generate soundbox speech in natural, reassuring Hindi
  const speechParts: string[] = [];
  for (const act of parsedActions) {
    if (act.type === 'cash_sale') {
      speechParts.push(`₹${act.amount} नकद प्राप्त हुए`);
    } else if (act.type === 'udhaar') {
      speechParts.push(`${act.customerName} का ₹${act.amount} उधार दर्ज हुआ`);
    } else if (act.type === 'udhaar_payment') {
      speechParts.push(`${act.customerName} से ₹${act.amount} उधार जमा हुआ`);
    }
  }

  const soundboxMessage = speechParts.join('। ') + '।';

  return {
    success: true,
    rawTranscript: cleanInput,
    detectedLanguage: 'hinglish',
    actions: parsedActions,
    soundboxMessage,
  };
}
