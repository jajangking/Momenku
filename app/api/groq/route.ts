import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b', // Gunakan model GPT OSS dari OpenAI melalui Groq
        messages: [
          {
            role: 'system',
            content: 'Anda adalah penulis cerita keluarga yang membantu pengguna menulis cerita yang indah dan bermakna tentang keluarga mereka. Buatlah cerita yang emosional, penuh kasih sayang, dan menggambarkan hubungan keluarga yang erat. Gunakan bahasa yang indah dan penuh perasaan.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate story');
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return NextResponse.json({ text: generatedText });
  } catch (error: any) {
    console.error('Error calling Groq API:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}