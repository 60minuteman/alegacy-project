import { NextResponse } from 'next/server';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RAVEN_API_URL = 'https://integrations.getravenbank.com/v1/collections';
const RAVEN_SECRET_KEY = process.env.RAVEN_SECRET_KEY;

if (!RAVEN_SECRET_KEY) {
  throw new Error('RAVEN_SECRET_KEY is not set');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountNumber = searchParams.get('account_number');

    console.log('Received request:', { accountNumber });

    if (!accountNumber) {
      return NextResponse.json({ success: false, message: 'Account number is required' }, { status: 400 });
    }

    // Verify payment with Raven
    const ravenResponse = await axios.get(RAVEN_API_URL, {
      params: { account_number: accountNumber },
      headers: {
        'Authorization': `Bearer ${RAVEN_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Raven API response:', JSON.stringify(ravenResponse.data, null, 2));

    if (ravenResponse.data.status === 'success' && ravenResponse.data.data.length > 0) {
      const paymentData = ravenResponse.data.data[0];
      const ravenAccountNumber = paymentData.account_number;
      
      // Find the pending registration in the database
      const pendingRegistration = await prisma.pendingRegistration.findUnique({
        where: { accountNumber: ravenAccountNumber },
      });

      if (pendingRegistration) {
        // Create a new user
        const user = await prisma.user.create({
          data: {
            email: pendingRegistration.email,
            firstName: pendingRegistration.firstName,
            lastName: pendingRegistration.lastName,
            phoneNumber: pendingRegistration.phoneNumber,
            totalInvestmentAmount: pendingRegistration.totalAmount,
            referralCode: generateReferralCode(),
            referralLink: generateReferralLink(),
          },
        });

        // Create investments
        const investments = await Promise.all(
          pendingRegistration.selectedPackages.map((pkg: any) =>
            prisma.investment.create({
              data: {
                packageName: pkg.packageName,
                investmentAmount: pkg.investmentAmount,
                userId: user.id,
              },
            })
          )
        );

        // Delete the pending registration
        await prisma.pendingRegistration.delete({
          where: { id: pendingRegistration.id },
        });

        console.log('User created:', user);
        console.log('Investments created:', investments);

        return NextResponse.json({ 
          success: true, 
          message: 'Payment verified and user created',
          data: { user, investments }
        });
      } else {
        console.log('No matching registration found');

        return NextResponse.json({ 
          success: false, 
          message: 'Payment verified, but no matching registration found'
        }, { status: 404 });
      }
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Payment verification failed or no data returned'
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify payment', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function generateReferralCode() {
  return 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateReferralLink() {
  return `https://yourdomain.com/refer/${generateReferralCode()}`;
}
