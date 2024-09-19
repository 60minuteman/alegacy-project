import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pendingRegistrationId = searchParams.get('id');

    if (!pendingRegistrationId) {
      return NextResponse.json({ success: false, message: 'Pending registration ID is required' }, { status: 400 });
    }

    const pendingRegistration = await prisma.pendingRegistration.findUnique({
      where: { id: parseInt(pendingRegistrationId) }
    });

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
