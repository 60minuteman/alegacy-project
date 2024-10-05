import { NextResponse } from 'next/server';
import { generateAccount } from '@/utils/payscribe';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received data in generate-account API:', JSON.stringify(body, null, 2));

    const { first_name, last_name, email, phone, amount, selectedPackages } = body;

    if (!first_name || !last_name || !email || !phone || amount === undefined) {
      console.log('Missing required fields:', { first_name, last_name, email, phone, amount });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Calling generateAccount with:', JSON.stringify({ firstName: first_name, lastName: last_name, email, phone, amount }, null, 2));
    
    const accountDetails = await generateAccount({ 
      firstName: first_name, 
      lastName: last_name, 
      email, 
      phone, 
      amount: Number(amount) 
    });
    
    console.log('Account details generated:', JSON.stringify(accountDetails, null, 2));

    if (accountDetails.status) {
      const account = accountDetails.message.details.account[0];
      const expiryDate = new Date(accountDetails.message.details.expiry_date);

      const pendingRegistration = await prisma.pendingRegistration.create({
        data: {
          firstName: first_name,
          lastName: last_name,
          email,
          phoneNumber: phone,
          totalAmount: parseFloat(amount),
          accountNumber: account.account_number,
          accountName: account.account_name,
          bank: account.bank_name,
          selectedPackages,
          expiryDate,
          paymentStatus: 'PENDING',
          sessionId: accountDetails.message.details.session_id
        }
      });

      return NextResponse.json({
        ...accountDetails,
        pendingRegistrationId: pendingRegistration.id
      });
    } else {
      return NextResponse.json(accountDetails);
    }
  } catch (error) {
    console.error('Error in generate-account API route:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'Failed to generate account', details: error.message }, { status: 500 });
  }
}
