import { NextResponse } from 'next/server';
import { getSupabase } from '@/types/supabase';

export async function GET() {
  const supabase = getSupabase();
  try {
    // Fetch all pending registrations with PAID status
    const { data: paidRegistrations, error: fetchError } = await supabase
      .from('PendingRegistration')
      .select('*')
      .eq('paymentStatus', 'PAID');

    if (fetchError) {
      console.error('Error fetching paid registrations:', fetchError);
      throw fetchError;
    }

    console.log('Paid registrations:', paidRegistrations);

    const results = [];

    for (const registration of paidRegistrations) {
      console.log('Processing registration:', registration);

      // Check if user already exists
      let { data: user, error: userError } = await supabase
        .from('User')
        .select('*')
        .eq('email', registration.email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user:', userError);
        throw userError;
      }

      if (!user) {
        console.log('Creating new user');
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('User')
          .insert({
            email: registration.email,
            phoneNumber: registration.phoneNumber,
            firstName: registration.firstName,
            lastName: registration.lastName,
            totalInvestmentAmount: registration.totalAmount,
            numberOfPackagesInvested: (registration.selectedPackages as any[]).length,
            role: "USER",
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          throw createError;
        }
        user = newUser;
      } else {
        console.log('Updating existing user');
        // Update existing user's investment details
        const { data: updatedUser, error: updateError } = await supabase
          .from('User')
          .update({
            totalInvestmentAmount: user.totalInvestmentAmount + registration.totalAmount,
            numberOfPackagesInvested: user.numberOfPackagesInvested + (registration.selectedPackages as any[]).length,
          })
          .eq('id', user.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
          throw updateError;
        }
        user = updatedUser;
      }

      console.log('User after create/update:', user);

      // Create investments
      const selectedPackages = registration.selectedPackages as { packageName: string, investmentAmount: number }[];
      const investments = await Promise.all(selectedPackages.map(async (pkg) => {
        const { data, error } = await supabase
          .from('Investment')
          .insert({
            packageName: pkg.packageName,
            investmentAmount: pkg.investmentAmount,
            userId: user.id
          })
          .select();
        
        if (error) {
          console.error('Error creating investment:', error);
          throw error;
        }
        return data[0];
      }));

      console.log('Created investments:', investments);

      // Delete the pending registration
      const { error: deleteError } = await supabase
        .from('PendingRegistration')
        .delete()
        .eq('id', registration.id);

      if (deleteError) {
        console.error('Error deleting pending registration:', deleteError);
        throw deleteError;
      }

      results.push({ user, investments });
    }

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
