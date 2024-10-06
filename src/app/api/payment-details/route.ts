import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pendingRegistrationId = searchParams.get('id');

    if (!pendingRegistrationId) {
      return NextResponse.json({ success: false, message: 'Pending registration ID is required' }, { status: 400 });
    }

    // Simulating fetching pending registration data
    // In a real scenario, you would replace this with your data fetching logic
    const pendingRegistration = await fetchPendingRegistration(parseInt(pendingRegistrationId));

    if (!pendingRegistration) {
      return NextResponse.json({ success: false, message: 'Pending registration not found' }, { status: 404 });
    }

    const ravenResponse = pendingRegistration.ravenResponse as any;
    const accountDetails = ravenResponse.data[0]; // Assuming the first account is the one we want

    return NextResponse.json({
      success: true,
      account_number: accountDetails.account_number,
      account_name: accountDetails.account_name,
      bank: accountDetails.bank,
      amount: pendingRegistration.amount
    });
  } catch (error: any) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payment details', details: error.message },
      { status: 500 }
    );
  }
}

// This function simulates fetching pending registration data
// You would need to implement this function to fetch data from your data source
async function fetchPendingRegistration(id: number) {
  // Implement your data fetching logic here
  // For now, we'll return a mock object
  return {
    id: id,
    ravenResponse: {
      data: [
        {
          account_number: '1234567890',
          account_name: 'John Doe',
          bank: 'Example Bank'
        }
      ]
    },
    amount: 1000
  };
}
