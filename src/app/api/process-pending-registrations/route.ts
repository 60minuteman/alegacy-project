import { NextResponse } from 'next/server';
import { supabase } from '@/types/supabase';

export async function processPendingRegistrations() {
  try {
    const { data: paidRegistrations, error } = await supabase
      .from('PendingRegistration')
      .select('*')
      .eq('paymentStatus', 'PAID');

    if (error) throw error;

    console.log(`Found ${paidRegistrations.length} paid registrations`);

    const results = [];

    for (const registration of paidRegistrations) {
      console.log(`Processing registration for email: ${registration.email}`);
      
      let { data: user, error: userError } = await supabase
        .from('User')
        .select('*')
        .eq('email', registration.email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (!user) {
        console.log(`Creating new user for email: ${registration.email}`);
        const { data: newUser, error: createError } = await supabase
          .from('User')
          .insert({
            email: registration.email,
            phoneNumber: registration.phoneNumber,
            firstName: registration.firstName,
            lastName: registration.lastName,
            totalInvestmentAmount: registration.totalAmount,
            numberOfPackagesInvested: registration.selectedPackages.length,
            role: "USER",
          })
          .single();

        if (createError) throw createError;
        user = newUser;
      } else {
        console.log(`Updating existing user for email: ${registration.email}`);
        const { data: updatedUser, error: updateError } = await supabase
          .from('User')
          .update({
            totalInvestmentAmount: user.totalInvestmentAmount + registration.totalAmount,
            numberOfPackagesInvested: user.numberOfPackagesInvested + registration.selectedPackages.length
          })
          .eq('id', user.id)
          .single();

        if (updateError) throw updateError;
        user = updatedUser;
      }

      console.log(`Creating investments for user: ${user.email}`);
      const investments = [];
      for (const pkg of registration.selectedPackages) {
        const { data: investment, error: investmentError } = await supabase
          .from('Investment')
          .insert({
            packageName: pkg.packageName,
            investmentAmount: pkg.investmentAmount,
            userId: user.id
          })
          .single();

        if (investmentError) throw investmentError;
        investments.push(investment);
      }

      console.log(`Deleting pending registration for email: ${registration.email}`);
      const { error: deleteError } = await supabase
        .from('PendingRegistration')
        .delete()
        .eq('id', registration.id);

      if (deleteError) throw deleteError;

      results.push({ user, investments });
    }

    return results;
  } catch (error) {
    console.error('Error processing pending registrations:', error);
    throw error;
  }
}

export async function GET(req: Request) {
  try {
    console.log('Processing pending registrations');
    const results = await processPendingRegistrations();
    console.log('Finished processing pending registrations');
    return NextResponse.json({ 
      status: 'success', 
      data: results
    });
  } catch (error) {
    console.error('Error processing pending registrations:', error);
    let errorMessage = 'Failed to process pending registrations';
    if (error instanceof Error) {
      errorMessage += ': ' + error.message;
    }
    return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
  }
}