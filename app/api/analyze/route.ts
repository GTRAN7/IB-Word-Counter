import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/geminiPrompt';
import { countWords } from '@/lib/wordCount';
import { AnalysisResult } from '@/lib/types';

export const maxDuration = 30;

const REQUIRED_FIELDS = ['assignmentType', 'subject', 'wordLimit', 'excludedItems', 'confidence', 'reasoning'];

function validateShape(obj: unknown): obj is AnalysisResult {
  if (typeof obj !== 'object' || obj === null) return false;
  const record = obj as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (!(field in record)) return false;
  }
  if (!Array.isArray(record.excludedItems)) return false;
  return true;
}

export async function POST(req: NextRequest) {
  let body: { text?: string; assignmentType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { text, assignmentType } = body;

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Missing text field' }, { status: 400 });
  }

  if (text.length < 50) {
    return NextResponse.json(
      { error: 'Text is too short. Please provide at least 50 characters.' },
      { status: 400 }
    );
  }

  if (text.length > 100_000) {
    return NextResponse.json(
      { error: 'Text is too long. Maximum 100,000 characters allowed.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error: missing API key' }, { status: 500 });
  }

  // Count original words locally — no AI involved
  const originalCount = countWords(text);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(buildUserMessage(text, assignmentType));
    const responseText = result.response.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    if (!validateShape(parsed)) {
      return NextResponse.json(
        { error: 'AI response had unexpected format. Please try again.' },
        { status: 500 }
      );
    }

    // Count excluded words locally by summing each item's content
    const excludedCount = parsed.excludedItems.reduce(
      (sum, item) => sum + countWords(item.content ?? ''),
      0
    );

    const wordCount = Math.max(0, originalCount - excludedCount);

    return NextResponse.json({ result: parsed, wordCount, originalCount, excludedCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('429') || message.toLowerCase().includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a moment and try again.' },
        { status: 429 }
      );
    }
    console.error('Gemini API error:', message);
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
