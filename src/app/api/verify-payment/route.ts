import { NextResponse } from 'next/server';
import { supabase } from '@/types/supabase';

export async function POST(req: Request) {
  try {
    const { account_number, amount, sessionId } = await req.json();

    console.log(`Verifying payment for account ${account_number} with amount ${amount} and sessionId ${sessionId}`);

    // Fetch pending registration
    const { data: pendingRegistration, error: fetchError } = await supabase
      .from('PendingRegistration')
      .select('*')
      .eq('accountNumber', account_number)
      .eq('totalAmount', parseFloat(amount))
      .single();

    if (fetchError) {
      console.error('Error fetching pending registration:', fetchError);
      return NextResponse.json({ success: false, message: 'Error fetching pending registration' }, { status: 500 });
    }

    if (!pendingRegistration) {
      return NextResponse.json({ success: false, message: 'No matching pending registration found' }, { status: 400 });
    }

    console.log(`Checking payment status for registration ${pendingRegistration.id}`);

    if (pendingRegistration.paymentStatus !== 'PAID') {
      return NextResponse.json({ success: false, message: 'Payment not yet verified, please make payment and try again' }, { status: 400 });
    }

    // Calculate total investment amount and number of packages
    const selectedPackages = pendingRegistration.selectedPackages;
    const totalInvestmentAmount = selectedPackages.reduce((total, pkg) => total + pkg.investmentAmount, 0);
    const numberOfPackagesInvested = selectedPackages.length;

    console.log('Selected Packages:', JSON.stringify(selectedPackages, null, 2));
    console.log(`Calculated total investment: ${totalInvestmentAmount}, Number of packages: ${numberOfPackagesInvested}`);

    // Check if user already exists
    const { data: existingUser, error: userFetchError } = await supabase
      .from('User')
      .select('*')
      .eq('email', pendingRegistration.email)
      .single();

    let user;
    let isNewInvestment = false;

    if (existingUser) {
      // Check if this sessionId has been processed before
      const { data: existingSession } = await supabase
        .from('ProcessedSessions')
        .select('*')
        .eq('sessionId', sessionId)
        .single();

      if (existingSession) {
        console.log(`Session ${sessionId} has already been processed. Skipping investment update.`);
        user = existingUser;
      } else {
        // Update existing user with new investment
        const { data: updatedUser, error: updateError } = await supabase
          .from('User')
          .update({
            totalInvestmentAmount: existingUser.totalInvestmentAmount + totalInvestmentAmount,
            numberOfPackagesInvested: existingUser.numberOfPackagesInvested + numberOfPackagesInvested
          })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
          throw updateError;
        }

        user = updatedUser;
        isNewInvestment = true;

        // Record the processed sessionId
        await supabase.from('ProcessedSessions').insert({ sessionId, userId: user.id });
      }
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('User')
        .insert({
          email: pendingRegistration.email,
          firstName: pendingRegistration.firstName,
          lastName: pendingRegistration.lastName,
          phoneNumber: pendingRegistration.phoneNumber,
          totalInvestmentAmount: totalInvestmentAmount,
          numberOfPackagesInvested: numberOfPackagesInvested
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }

      user = newUser;
      isNewInvestment = true;

      // Record the processed sessionId
      await supabase.from('ProcessedSessions').insert({ sessionId, userId: user.id });
    }

    // Create investments for the user only if it's a new investment
    if (isNewInvestment) {
      const investments = selectedPackages.map(pkg => ({
        userId: user.id,
        packageName: pkg.packageName,
        investmentAmount: pkg.investmentAmount,
        investmentDate: new Date().toISOString()
      }));

      const { error: investmentError } = await supabase
        .from('Investment')
        .insert(investments);

      if (investmentError) {
        console.error('Error creating investments:', investmentError);
        throw investmentError;
      }

      console.log(`Created/updated user and investments for registration ${pendingRegistration.id}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified and user account created/updated',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          totalInvestmentAmount: user.totalInvestmentAmount,
          numberOfPackagesInvested: user.numberOfPackagesInvested
        }
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, message: 'An error occurred while verifying payment' }, { status: 500 });
  }
}