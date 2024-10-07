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
    // Find the pending registration
    const { data: pendingRegistration, error: findError } = await supabase
      .from('PendingRegistration')
      .select('*')
      .eq('accountNumber', accountNumber)
      .eq('totalAmount', amount)
      .single();

    if (findError || !pendingRegistration) {
      console.log(`No pending registration found for accountNumber: ${accountNumber}`);
      return;
    }

    // Update the pending registration
    const { error: updateError } = await supabase
      .from('PendingRegistration')
      .update({
        paymentStatus: 'PAID',
        sessionId: session_id,
        transId: trans_id,
        webhookResponse: fullWebhookPayload,
      })
      .eq('id', pendingRegistration.id);

    if (updateError) {
      throw updateError;
    }

    // Automatically verify the payment
    await verifyPayment(pendingRegistration);

    console.log(`Updated and verified pending registration for account ${accountNumber} with session_id: ${session_id}`);

  } catch (error) {
    console.error('Error handling payment status:', error);
  }
}

async function verifyPayment(pendingRegistration: any) {
  try {
    // Check if user exists
    const { data: existingUser, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('email', pendingRegistration.email)
      .single();

    let user;

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('User')
        .update({
          totalInvestmentAmount: existingUser.totalInvestmentAmount + pendingRegistration.totalAmount,
          numberOfPackagesInvested: existingUser.numberOfPackagesInvested + pendingRegistration.selectedPackages.length,
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateError) throw updateError;
    } else {
      // Create new user
      const { data: newUser, error: createUserError } = await supabase
        .from('User')
        .insert({
          email: pendingRegistration.email,
          firstName: pendingRegistration.firstName,
          lastName: pendingRegistration.lastName,
          phoneNumber: pendingRegistration.phoneNumber || '',
          totalInvestmentAmount: pendingRegistration.totalAmount,
          numberOfPackagesInvested: pendingRegistration.selectedPackages.length,
          referralCode: pendingRegistration.sessionId || '',
          referralLink: `https://yourdomain.com/register?ref=${pendingRegistration.sessionId || ''}`,
        })
        .single();

      if (createUserError) throw createUserError;

      user = newUser;
    }

    // Create investments
    await Promise.all((pendingRegistration.selectedPackages as any[]).map((pkg: any) =>
      supabase
        .from('Investment')
        .insert({
          packageName: pkg.packageName || 'Unknown Package',
          investmentAmount: pkg.investmentAmount || 0,
          userId: user.id,
        })
        .single()
    ));

    console.log('Payment verified successfully');
  } catch (error) {
    console.error('Error verifying payment:', error);
  }
}

// You can add more helper functions here as needed
// async function createUserAndInvestments(pendingRegistration: any) { ... }