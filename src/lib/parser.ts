import { ParsedVoiceAction, VoiceProcessResult } from '@/types/ledger';

// Map Hindi number words (both phonetic Hinglish and Devanagari) to integers
const hindiNumbers: Record<string, number> = {
  // English phonetic numbers
  'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5, 'panch': 5,
  'chhe': 6, 'saat': 7, 'aath': 8, 'nau': 9, 'das': 10, 'dus': 10,
  'gyarah': 11, 'barah': 12, 'terah': 13, 'chaudah': 14, 'pandrah': 15,
  'solah': 16, 'satrah': 17, 'atharah': 18, 'unnis': 19, 'bees': 20,
  'tees': 30, 'chalis': 40, 'pachaas': 50, 'pachas': 50,
  'saath': 60, 'sattar': 70, 'assi': 80, 'nabbe': 90,
  'sau': 100, 'ek sau': 100, 'derh sau': 150, 'dedh sau': 150,
  'do sau': 200, 'teen sau': 300, 'char sau': 400, 'paanch sau': 500,
  'hazaar': 1000, 'hazar': 1000,

  // Devanagari words
  'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5,
  'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
  'ग्यारह': 11, 'बारह': 12, 'तेरह': 13, 'चौदह': 14, 'पंद्रह': 15,
  'सोलह': 16, 'सत्रह': 17, 'अट्ठारह': 18, 'उन्नीस': 19, 'बीस': 20,
  'तीस': 30, 'चालीस': 40, 'पचास': 50,
  'साठ': 60, 'सत्तर': 70, 'अस्सी': 80, 'नब्बे': 90,
  'सौ': 100, 'डेढ़ सौ': 150, 'दो सौ': 200, 'तीन सौ': 300, 'चार सौ': 400, 'पांच सौ': 500,
  'हज़ार': 1000, 'हजार': 1000,
};

function normalizeHindiNumbers(text: string): string {
  let res = text;
  // Convert Devanagari digits ०-९ to 0-9
  res = res.replace(/[०-९]/g, (d) => '०१२३४५६७८९'.indexOf(d).toString());

  // Replace word-numbers
  for (const [word, num] of Object.entries(hindiNumbers)) {
    const regex = new RegExp(`(^|\\s)${word}($|\\s)`, 'gi');
    res = res.replace(regex, `$1${num}$2`);
  }
  return res;
}

function detectCategory(text: string): 'chai' | 'snacks' | 'grocery' | 'cigarettes' | 'beverages' | 'other' {
  const lower = text.toLowerCase();
  if (lower.includes('chai') || lower.includes('tea') || lower.includes('cutting') || text.includes('चाय')) return 'chai';
  if (lower.includes('samosa') || lower.includes('bun') || lower.includes('maska') || lower.includes('kachori') || lower.includes('pakode') || lower.includes('biscuit') || lower.includes('toast') || lower.includes('chips') || text.includes('समोसा') || text.includes('नाश्ता')) return 'snacks';
  if (lower.includes('bidi') || lower.includes('beedi') || lower.includes('cigarette') || lower.includes('pan') || lower.includes('gutkha') || text.includes('बीड़ी') || text.includes('सिगरेट') || text.includes('पान')) return 'cigarettes';
  if (lower.includes('cold drink') || lower.includes('pani') || lower.includes('water') || lower.includes('pepsi') || lower.includes('frooti') || lower.includes('coke') || lower.includes('lassi') || text.includes('पानी') || text.includes('दूध')) return 'beverages';
  if (lower.includes('atta') || lower.includes('dal') || lower.includes('chini') || lower.includes('tel') || lower.includes('oil') || lower.includes('soap') || text.includes('किराना')) return 'grocery';
  return 'other';
}

/**
 * Extracts the monetary transaction amount from a spoken clause.
 * Supports rupees indicators in Hinglish and Hindi Devanagari.
 */
function extractAmountAndQuantity(clause: string): { amount: number; quantity: number } {
  // 1. Explicit currency indicators: "20 rupaye", "₹20", "20 rs", "२० रुपये", "20 रुपये"
  const explicitCurrencyMatch = clause.match(/(\d+)\s*(?:rupaye|rupee|rupya|rs|₹|\/-|रुपये|रुपया|रु)/i);
  if (explicitCurrencyMatch) {
    const amt = parseInt(explicitCurrencyMatch[1], 10);
    // Find quantity (e.g. "2 chai")
    const qtyMatch = clause.match(/\b(\d+)\s*(?:cup|plate|chai|samosa|bidi|pack|packet|bun|cigarette|chips|कप|प्लेट|चाय|समोसा)?\b/i);
    let qty = 1;
    if (qtyMatch && parseInt(qtyMatch[1], 10) !== amt) {
      qty = parseInt(qtyMatch[1], 10);
    }
    return { amount: amt, quantity: qty > 0 && qty < 100 ? qty : 1 };
  }

  // 2. Look for financial context keywords: "40 ka udhaar", "40 udhar", "50 cash", "100 jama", "४० उधार"
  const contextMatch = clause.match(/(\d+)\s*(?:ka|ki|ke|का|की|के)?\s*(?:udhaar|udhar|udhari|baki|baaki|cash|nagad|jama|chukaya|wapas|bored|उधार|बाकी|नकद|कैश|जमा|चुकाया)/i);
  if (contextMatch) {
    return { amount: parseInt(contextMatch[1], 10), quantity: 1 };
  }

  // 3. Look for number preceding context: "udhar 40", "उधार 40"
  const preContextMatch = clause.match(/(?:udhaar|udhar|baki|cash|jama|उधार|बाकी|नकद|जमा)\s*(?:ka|ki|ke|का|की|के)?\s*(\d+)/i);
  if (preContextMatch) {
    return { amount: parseInt(preContextMatch[1], 10), quantity: 1 };
  }

  // 4. Fallback: extract standalone numbers (excluding ordinals like 4th)
  const numbers: number[] = [];
  const numRegex = /\b(\d+)(?!(?:st|nd|rd|th))\b/gi;
  let match;
  while ((match = numRegex.exec(clause)) !== null) {
    numbers.push(parseInt(match[1], 10));
  }

  if (numbers.length === 1) {
    return { amount: numbers[0], quantity: 1 };
  } else if (numbers.length >= 2) {
    const sorted = [...numbers].sort((a, b) => b - a);
    return { amount: sorted[0], quantity: sorted[1] };
  }

  return { amount: 0, quantity: 1 };
}

/**
 * Intelligent deterministic parser for Hindi / Hinglish shopkeeper voice notes.
 * Accurately handles:
 * - Udhaar (credit given / baki / khata / bored given) in Hinglish & Devanagari Hindi
 * - Udhaar payments (wapas, jama, chukaya)
 * - Cash sales (money taken / cash kamai)
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

  // Pre-normalize Hindi spoken numbers and Devanagari numerals
  const normalized = normalizeHindiNumbers(cleanInput);

  // Split compound clauses by "aur", "and", "or", ",", "phir", "sath me", "और", "तथा"
  const clauses = normalized
    .split(/\s+(?:aur|and|phir|saath\s+mein|tatha|और|तथा|,|\+)\s+/i)
    .map((c) => c.trim())
    .filter(Boolean);

  const parsedActions: ParsedVoiceAction[] = [];

  for (const clause of clauses) {
    // Comprehensive regex for Udhaar indicators (including Devanagari & common STT acoustic variants like "bored given")
    const udhaarRegex = /(?:udhaar|udhar|udhari|udar|baki|baaki|khata|khate|credit|kredit|likh\s*lo|likho|likh\s*dena|likh\s*do|ke\s*naam|bored\s*given|board\s*given|bored\s*diya|bore\s*diya|udhar\s*given|other\s*given|उधार|उधारी|बाकी|खाता|खाते|क्रेडिट|लिख\s*लो|लिखो|लिख\s*देना|लिख\s*दो|के\s*नाम)/i;

    // Comprehensive regex for Repayment/Settlement indicators (wapas, jama, chukaya)
    const paymentRegex = /(?:wapas|waapis|jama|chukaya|chuka\s*diya|lautaya|settle|वापस|जमा|चुकाया|लौटाया)/i;

    const hasUdhaar = udhaarRegex.test(clause);
    const hasPayment = paymentRegex.test(clause);

    // Is Payment: MUST have payment keyword and NOT mean "udhar diya" / "udhar diye"
    const isPayment = hasPayment && !/(?:udhaar\s*diya|udhar\s*diye|udhar\s*de|उधार\s*दिया|उधार\s*दिए|bored\s*given)/i.test(clause);

    // Is Udhaar: mentions udhaar / baki / khata / bored given, AND is not a repayment
    const isUdhaar = (hasUdhaar || /bored\s*given/i.test(clause)) && !isPayment;

    const { amount, quantity } = extractAmountAndQuantity(clause);

    if (isPayment) {
      // Extract customer name
      let customerName = 'Grahak';
      const nameMatch = clause.match(/(?:ne\s+|ka\s+|से\s+|का\s+)?([A-Za-z\u0900-\u097F]+(?:\s+ji|\s+bhai|\s+जी|\s+भाई)?)\s*(?:ne|ka|ने|का|se|से)?/i);
      if (nameMatch) {
        const cleaned = nameMatch[1].replace(/\b(?:ne|ka|se|ko|jama|rupaye|\d+|ने|का|से|को|जमा|रुपये)\b/gi, '').trim();
        if (cleaned.length > 1) customerName = cleaned;
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

      // Check for location tag like "...wale", "...shop", "...stand", "...वाले"
      const locMatch = clause.match(/([a-zA-Z0-9\s\u0900-\u097F]+(?:wale|stand|nukkad|shop|market|वाले|स्टैंड|नुक्कड़|दुकान))/i);
      if (locMatch) {
        customerIdentifier = locMatch[1].trim();
      }

      // Check for customer name before "ka", "ko", "ke naam", "का", "को", "के नाम"
      const nameKaMatch = clause.match(/(?:wale|stand|nukkad|वाले|स्टैंड)?\s*([A-Za-z\u0900-\u097F]+(?:\s+ji|\s+bhai|\s+जी|\s+भाई)?)\s+(?:ka|ko|ke\s+naam|का|को|के\s+नाम)/i);
      if (nameKaMatch) {
        const cleaned = nameKaMatch[1].replace(/\b(?:wale|street|stand|ka|ko|वाले|का|को)\b/gi, '').trim();
        if (cleaned.length > 1) customerName = cleaned;
      } else {
        // Fallback: look for capitalized name or first word
        const words = clause
          .replace(/([a-zA-Z0-9\s\u0900-\u097F]+(?:wale|stand|nukkad|वाले))/gi, '')
          .replace(/(?:udhaar|udhar|udhari|udar|baki|baaki|khata|credit|likh\s*lo|likho|rupaye|rs|\d+|ka|ko|ke|bored\s*given|bored|given|diya|diye|उधार|उधारी|बाकी|खाता|रुपये|का|को|दिए|दिया|लिख\s*लो|लिखो)/gi, '')
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

    // Default: Cash Sale (money taken)
    const category = detectCategory(clause);
    const cleanDesc = clause
      .replace(/\b(?:bechi|becha|bika|cash|nagad|aaya|mila|rupaye|rs|\d+|बेची|बेचा|बिका|कैश|नकद|आया|मिला|रुपये)\b/gi, '')
      .replace(/[^\w\s\u0900-\u097F]/gi, '')
      .trim();

    parsedActions.push({
      type: 'cash_sale',
      amount: amount || 20,
      description: cleanDesc ? cleanDesc.charAt(0).toUpperCase() + cleanDesc.slice(1) : `${category.toUpperCase()} बिक्री`,
      quantity: quantity,
      category: category,
      paymentMode: clause.toLowerCase().includes('upi') || clause.includes('ऑनलाइन') ? 'upi' : 'cash',
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
