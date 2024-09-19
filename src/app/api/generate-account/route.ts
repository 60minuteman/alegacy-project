import { NextResponse } from 'next/server';
import axios from 'axios';
import prisma from '@/lib/prisma';

const RAVEN_API_URL = 'https://integrations.getravenbank.com/v1/pwbt/generate_account';
const RAVEN_SECRET_KEY = process.env.RAVEN_SECRET_KEY;

if (!RAVEN_SECRET_KEY) {
  throw new Error('RAVEN_SECRET_KEY is not set');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    // Input validation
    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'amount', 'selectedPackages'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          status: 'error', 
          message: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Generate collection account with Raven API
    const ravenResponse = await axios.post(RAVEN_API_URL, {
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone,
      amount: body.amount,
      email: body.email
    }, {
      headers: {
        'Authorization': `Bearer ${RAVEN_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Raven API response:', JSON.stringify(ravenResponse.data, null, 2));

    if (ravenResponse.data.status === 'success') {
      const { account_number, account_name, bank, amount } = ravenResponse.data.data;

      // Create a new PendingRegistration in the database
      const pendingRegistration = await prisma.pendingRegistration.create({
        data: {
          firstName: body.first_name,
          lastName: body.last_name,
          email: body.email,
          phoneNumber: body.phone,
          totalAmount: parseFloat(amount), // Use the amount from Raven response
          accountNumber: account_number,
          accountName: account_name,
          bank: bank,
          selectedPackages: body.selectedPackages,
        },
      });

      console.log('Created PendingRegistration:', JSON.stringify(pendingRegistration, null, 2));

      return NextResponse.json({
        status: 'success',
        message: 'Account generated successfully',
        data: {
          account_number,
          account_name,
          bank,
          amount,
          pendingRegistrationId: pendingRegistration.id
        }
      });
    } else {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Failed to generate account'
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error in generate-account:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { status: 'error', message: 'Failed to generate account', details: error.message },
      { status: 500 }
    );
  }
}
