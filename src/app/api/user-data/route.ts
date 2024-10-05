import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    const user = await prisma.user.findFirst({
      where: { email },
      include: { 
        investments: true,
      },
    });

    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User found:', JSON.stringify(user, null, 2));

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      totalInvestmentAmount: user.totalInvestmentAmount,
      numberOfPackagesInvested: user.numberOfPackagesInvested,
      referralCode: user.referralCode,
      referralLink: user.referralLink,
      investments: user.investments,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
