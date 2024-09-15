import { NextResponse } from 'next/server';

const RAVEN_SECRET_KEY = process.env.RAVEN_SECRET_KEY;

export async function POST(request: Request) {
  if (!RAVEN_SECRET_KEY) {
    return NextResponse.json({ error: 'Raven Secret Key is not set' }, { status: 500 });
  }

  try {
    const payload = await request.json();
    const response = await fetch('https://integrations.getravenbank.com/v1/pwbt/generate_account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RAVEN_SECRET_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in generate-account API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
