import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY || ''}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch models');
    }

    const data = await response.json();
    
    // Filter hanya model yang tersedia untuk penggunaan
    const availableModels = data.data.filter((model: any) => 
      model.owned_by === 'groq' || model.owned_by === 'meta' || model.owned_by === 'google'
    );

    return NextResponse.json({ models: availableModels });
  } catch (error: any) {
    console.error('Error fetching Groq models:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}