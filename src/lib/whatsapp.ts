export interface WhatsAppMessagePayload {
  toPhoneNumber: string;
  customerName: string;
  amount: number;
  shopName?: string;
  dueDate?: string;
}

/**
 * Builds a polite, professional reminder in Hindi & Hinglish for WhatsApp
 */
export function buildReminderText(customerName: string, amount: number, shopName = 'बहीखाता चाय & जनरल स्टोर'): string {
  return `🙏 *नमस्ते ${customerName} जी*,

आपकी *${shopName}* पर *₹${amount}* की उधारी (बकाया हिसाब) बाकी है।

कृपया समय मिलने पर इसका भुगतान (UPI या नकद) कर दें।

📱 _यह संदेश बहीखाता आवाज़ द्वारा स्वतः भेजा गया है।_`;
}

/**
 * Generates an instant WhatsApp Click-to-Chat URL
 * Works on mobile, web, and desktop without requiring any API keys.
 */
export function generateWhatsAppLink(customerName: string, amount: number, rawPhone?: string, shopName?: string): string {
  const text = buildReminderText(customerName, amount, shopName);
  const encodedText = encodeURIComponent(text);

  let formattedPhone = '';
  if (rawPhone) {
    const cleaned = rawPhone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      formattedPhone = `91${cleaned}`;
    } else if (cleaned.length > 10) {
      formattedPhone = cleaned;
    }
  }

  if (formattedPhone) {
    return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}
