import { NextResponse } from 'next/server';
import { supabase } from '@/types/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received webhook payload:', JSON.stringify(body, null, 2));

    const { event_type, trans_id, amount, transaction, customer } = body;

    if (event_type === 'accounts.payment.status') {
      await handlePaymentStatus(trans_id, amount, transaction, customer, body);
    } else {
      console.log('Unhandled event type:', event_type);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePaymentStatus(trans_id: string, amount: number, transaction: any, customer: any, fullWebhookPayload: any) {
  const { session_id } = transaction;
  const { number: accountNumber } = customer;

  try {
    const pendingRegistration = await prisma.pendingRegistration.findFirst({
      where: { accountNumber: accountNumber, totalAmount: amount }
    });

    if (!pendingRegistration) {
      console.log(`No pending registration found for accountNumber: ${accountNumber}`);
      return;
    }

    // Update the pending registration
    await prisma.pendingRegistration.update({
      where: { id: pendingRegistration.id },
      data: {
        paymentStatus: 'PAID',
        sessionId: session_id,
        transId: trans_id,
        webhookResponse: fullWebhookPayload,
      },
    });

    // Automatically verify the payment
    await verifyPayment(pendingRegistration);

    console.log(`Updated and verified pending registration for account ${accountNumber} with session_id: ${session_id}`);

  } catch (error) {
    console.error('Error handling payment status:', error);
  }
}

async function verifyPayment(pendingRegistration: any) {
  try {
    let user = await prisma.user.findUnique({ where: { email: pendingRegistration.email } });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { email: pendingRegistration.email },
        data: {
          totalInvestmentAmount: { increment: pendingRegistration.totalAmount },
          numberOfPackagesInvested: { increment: (pendingRegistration.selectedPackages as any[]).length },
        }
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: pendingRegistration.email,
          firstName: pendingRegistration.firstName,
          lastName: pendingRegistration.lastName,
          phoneNumber: pendingRegistration.phoneNumber || '',
          totalInvestmentAmount: pendingRegistration.totalAmount,
          numberOfPackagesInvested: (pendingRegistration.selectedPackages as any[]).length,
          referralCode: pendingRegistration.sessionId || '',
          referralLink: `https://yourdomain.com/register?ref=${pendingRegistration.sessionId || ''}`,
        }
      });
    }

    // Create investments
    await Promise.all((pendingRegistration.selectedPackages as any[]).map((pkg: any) =>
      prisma.investment.create({
        data: {
          packageName: pkg.packageName || 'Unknown Package',
          investmentAmount: pkg.investmentAmount || 0,
          userId: user.id,
        }
      })
    ));

    console.log('Payment verified successfully');
  } catch (error) {
    console.error('Error verifying payment:', error);
  }
}

// You can add more helper functions here as needed
// async function createUserAndInvestments(pendingRegistration: any) { ... }