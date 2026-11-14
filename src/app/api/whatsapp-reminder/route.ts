import { NextRequest, NextResponse } from 'next/server';
import { buildReminderText } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const { customerName, amount, phoneNumber, shopName } = await req.json();

    if (!customerName || !amount) {
      return NextResponse.json(
        { error: 'Customer name and amount are required' },
        { status: 400 }
      );
    }

    const token = process.env.META_WHATSAPP_TOKEN || req.headers.get('x-meta-token');
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID || req.headers.get('x-meta-phone-id');

    const reminderMessage = buildReminderText(customerName, amount, shopName);

    // If Meta Cloud API credentials are provided, send message via WhatsApp Business API
    if (token && phoneNumberId && phoneNumber) {
      let formattedPhone = phoneNumber.replace(/\D/g, '');
      if (formattedPhone.length === 10) formattedPhone = `91${formattedPhone}`;

      const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: { body: reminderMessage },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { success: false, error: data.error?.message || 'Meta API error', directLink: false },
          { status: res.status }
        );
      }

      return NextResponse.json({ success: true, messageId: data.messages?.[0]?.id });
    }

    // Otherwise return success with pre-generated text for client direct link
    return NextResponse.json({
      success: true,
      directLink: true,
      text: reminderMessage,
    });
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
