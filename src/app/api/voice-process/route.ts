import { NextRequest, NextResponse } from 'next/server';
import { parseVoiceIntentLocally } from '@/lib/parser';
import { VoiceProcessResult, ParsedVoiceAction } from '@/types/ledger';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let transcript = '';
    let audioBuffer: Buffer | null = null;
    let audioMimeType = 'audio/webm';

    // Handle multipart/form-data (audio blob uploaded from client)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File | null;
      const textParam = formData.get('transcript') as string | null;

      if (textParam) {
        transcript = textParam;
      }

      if (audioFile) {
        const arrayBuffer = await audioFile.arrayBuffer();
        audioBuffer = Buffer.from(arrayBuffer);
        audioMimeType = audioFile.type || 'audio/webm';
      }
    } else {
      // Handle application/json
      const body = await req.json();
      transcript = body.transcript || '';
    }

    const groqKey = process.env.GROQ_API_KEY || req.headers.get('x-groq-key') || '';
    const geminiKey = process.env.GEMINI_API_KEY || req.headers.get('x-gemini-key') || '';

    // Step 1: Speech-to-Text Transcription via Groq Whisper if audio was provided
    if (!transcript && audioBuffer && groqKey) {
      try {
        const groqFormData = new FormData();
        const uint8Array = new Uint8Array(audioBuffer);
        const audioBlob = new Blob([uint8Array], { type: audioMimeType });
        groqFormData.append('file', audioBlob, 'voice_note.webm');
        groqFormData.append('model', 'whisper-large-v3');
        groqFormData.append('language', 'hi'); // Supports Hindi & Hinglish mixture
        groqFormData.append('response_format', 'json');

        const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqKey}`,
          },
          body: groqFormData,
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          transcript = groqData.text || '';
        }
      } catch (err) {
        console.warn('Groq Whisper STT error, falling back:', err);
      }
    }

    // Step 2: If we still don't have transcript but have audio and Gemini Key, use Gemini Multimodal Audio
    if (!transcript && audioBuffer && geminiKey) {
      try {
        const base64Audio = audioBuffer.toString('base64');
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

        const geminiPayload = {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: audioMimeType,
                    data: base64Audio,
                  },
                },
                {
                  text: 'Please listen to this voice note spoken by an Indian shopkeeper (in Hindi, Hinglish, or English) and transcribe the exact words spoken into text. Return ONLY the transcribed text.',
                },
              ],
            },
          ],
        };

        const gRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiPayload),
        });

        if (gRes.ok) {
          const gData = await gRes.json();
          transcript = gData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        }
      } catch (err) {
        console.warn('Gemini Audio STT error:', err);
      }
    }

    // If still no transcript, check if client provided any fallback or return local notice
    if (!transcript) {
      return NextResponse.json(
        {
          success: false,
          error: 'No audio or transcript received. Please speak clearly into the microphone or configure an API key.',
          rawTranscript: '',
          actions: [],
          soundboxMessage: 'कृपया साफ आवाज़ में दोबारा बोलें या सेटिंग्स में Groq/Gemini Key डालें।',
        },
        { status: 200 }
      );
    }

    // Step 3: Intent Parsing & Structuring via Google Gemini API
    if (geminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

        const prompt = `You are the AI core for BahiKhaata Voice, a voice-first financial ledger for Indian street vendors (chaiwalas, kirana stores).
The vendor spoke: "${transcript}"

Extract all financial transactions from this voice note.
CRITICAL RULES FOR TRANSACTION TYPES:
1. "udhaar" (Credit given / pending customer debt): Any mention of "udhaar", "udhar", "baki", "khata", "likh lo", "likho", "udhar diya", "udhar diye", "उधार", "बाकी", "खाता", "उधार दिया", or speech-to-text acoustic errors like "bored given" / "board given" / "udhar given" MUST be categorized as "udhaar"!
2. "udhaar_payment" (Credit repayment / settlement): Any mention of returning or settling existing debt ("wapas diya", "jama kar diya", "chukaya", "वापस दिया", "जमा किया") MUST be categorized as "udhaar_payment".
3. "cash_sale" (Direct cash sales / money taken): Only direct cash earnings without any udhaar/credit context ("cash", "nagad", "bechi", "bika", "नकद", "कैश") are "cash_sale".

A single sentence may contain MULTIPLE actions (e.g. "2 chai bechi 20 rupaye ki, aur 4th street wale Ramesh ka 40 rupaye udhaar likh lo" -> 1 cash_sale of ₹20, 1 udhaar of ₹40 for Ramesh).

Return ONLY a valid JSON object matching this schema without markdown or backticks:
{
  "detected_language": "hindi" | "hinglish" | "english",
  "actions": [
    {
      "type": "cash_sale" | "udhaar" | "udhaar_payment",
      "amount": number,
      "description": string,
      "customerName": string (for udhaar or udhaar_payment),
      "customerIdentifier": string (e.g. location or shop tag like "4th street wale", "auto stand"),
      "quantity": number,
      "unit": string,
      "category": "chai" | "snacks" | "grocery" | "cigarettes" | "beverages" | "other",
      "paymentMode": "cash" | "upi"
    }
  ],
  "soundboxMessage": string (Concise confirmation message in Hindi, e.g. "₹20 नकद प्राप्त हुए, रमेश का ₹40 उधार दर्ज हुआ।")
}`;

        const gRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (gRes.ok) {
          const gData = await gRes.json();
          const rawText = gData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const result: VoiceProcessResult = {
              success: true,
              rawTranscript: transcript,
              detectedLanguage: parsed.detected_language || 'hinglish',
              actions: (parsed.actions || []).map((a: ParsedVoiceAction) => ({
                ...a,
                amount: Number(a.amount) || 0,
              })),
              soundboxMessage: parsed.soundboxMessage || 'हिसाब दर्ज हो गया है।',
            };
            return NextResponse.json(result);
          }
        }
      } catch (err) {
        console.warn('Gemini intent parsing failed, using smart local parser fallback:', err);
      }
    }

    // Step 4: Deterministic Local NLP Parser Fallback
    const localResult = parseVoiceIntentLocally(transcript);
    return NextResponse.json(localResult);
  } catch (error: unknown) {
    console.error('Voice processing route error:', error);
    const errMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: errMessage,
        rawTranscript: '',
        actions: [],
        soundboxMessage: 'त्रुटि हुई। कृपया दोबारा प्रयास करें।',
      },
      { status: 200 }
    );
  }
}
