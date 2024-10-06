import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authMiddleware } from '@/lib/authMiddleware';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function handler(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { firstName, lastName, phoneNumber, investmentAmount, packageName } = await req.json();
    const userEmail = (req as any).userEmail;
    const isNewUser = (req as any).isNewUser;

    let user;

    if (isNewUser) {
      // Create new user
      const { data: newUser, error } = await supabase
        .from('User')
        .insert({
          email: userEmail,
          firstName,
          lastName,
          phoneNumber,
          ravenSessionId: (req as any).sessionId,
          referralCode: await generateReferralCode(),
        })
        .single();

      if (error) throw error;
      user = newUser;
    } else {
      // Update existing user
      const { data: updatedUser, error } = await supabase
        .from('User')
        .update({
          firstName,
          lastName,
          phoneNumber,
        })
        .eq('email', userEmail)
        .single();

      if (error) throw error;
      user = updatedUser;
    }

    // Create new investment record
    if (investmentAmount && packageName) {
      const { error: investmentError } = await supabase
        .from('Investment')
        .insert({
          userId: user.id,
          packageName,
          investmentAmount,
          investmentDate: new Date().toISOString(),
        });

      if (investmentError) throw investmentError;

      // Update user's total investment amount and number of packages
      const { error: updateError } = await supabase.rpc('update_user_investment', {
        user_id: user.id,
        investment_amount: investmentAmount,
      });

      if (updateError) throw updateError;
    }

    // Fetch updated user data
    const { data: updatedUser, error: fetchError } = await supabase
      .from('User')
      .select('*, investments(*)')
      .eq('id', user.id)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json({ success: false, message: 'Error processing request' }, { status: 500 });
  }
}

async function generateReferralCode() {
  const { data, error } = await supabase.rpc('generate_referral_code');
  if (error) throw error;
  return data;
}

export const POST = authMiddleware(handler);
