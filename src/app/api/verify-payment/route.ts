import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountNumber = searchParams.get('accountNumber');
  const amount = searchParams.get('amount');

  console.log('Received request with params:', { accountNumber, amount });

  if (!accountNumber || !amount) {
    console.error('Missing required parameters');
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    if (!process.env.RAVEN_SECRET_KEY) {
      throw new Error('RAVEN_SECRET_KEY is not defined');
    }

    const ravenUrl = `https://integrations.getravenbank.com/v1/collections?account_number=${accountNumber}`;
    const headers = {
      'Authorization': `Bearer ${process.env.RAVEN_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };

    console.log('Sending request to Raven API:', { url: ravenUrl, headers });

    const response = await fetch(ravenUrl, {
      method: 'GET',
      headers: headers,
    });

    console.log('Raven API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Raven API error:', response.status, errorText);
      return NextResponse.json({ error: `Raven API error: ${response.statusText}`, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    console.log('Raven API response:', JSON.stringify(data, null, 2));

    if (!Array.isArray(data.data)) {
      throw new Error('Unexpected response format from Raven API');
    }

    const transaction = data.data.find((t: any) => parseFloat(t.amount) === parseFloat(amount));

    if (transaction) {
      console.log('Payment verified successfully');
      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      console.log('Payment not found or amount mismatch');
      return NextResponse.json({ success: false, message: 'Payment not found or amount mismatch' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: `Failed to verify payment: ${error.message}` }, { status: 500 });
  }
}
