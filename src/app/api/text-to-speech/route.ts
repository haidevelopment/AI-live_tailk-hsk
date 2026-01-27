import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, lang = 'zh-CN' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Use Google Cloud Text-to-Speech API if available
    // For now, we'll use a browser-based solution via Web Speech API on the client
    // This endpoint can be expanded to use Google Cloud TTS for better quality

    // Return the text for client-side TTS
    return NextResponse.json({ 
      text,
      lang,
      useClientTTS: true 
    });
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
