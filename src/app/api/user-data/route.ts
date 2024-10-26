import { NextResponse } from 'next/server';
import { supabase } from '@/types/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  console.log('API received email:', email);

  if (!email) {
    console.log('Email is missing in the request');
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    console.log('Searching for user with email:', email);
    const { data: user, error: userError } = await supabase
      .from('User')
      .select(`
        id,
        email,
        firstName,
        lastName,
        phoneNumber,
        totalInvestmentAmount,
        numberOfPackagesInvested,
        referralCode,
        referralLink
      `)
      .eq('email', email)
      .single();

    if (userError) {
      console.log('User not found for email:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User found:', JSON.stringify(user, null, 2));

    // Fetch investments for the user
    const { data: investments, error: investmentError } = await supabase
      .from('Investment')
      .select('*')
      .eq('userId', user.id);

    if (investmentError) {
      console.error('Error fetching investments:', investmentError);
      return NextResponse.json({ error: 'Error fetching investments' }, { status: 500 });
    }

    // Calculate the actual number of packages invested
    const actualNumberOfPackages = investments ? investments.length : 0;

    // Calculate the actual total investment amount
    const actualTotalInvestmentAmount = investments
      ? investments.reduce((total, investment) => total + investment.investmentAmount, 0)
      : 0;

    const userData = {
      ...user,
      investments,
      numberOfPackagesInvested: actualNumberOfPackages,
      totalInvestmentAmount: actualTotalInvestmentAmount,
    };

    console.log('Final user data:', JSON.stringify(userData, null, 2));

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
