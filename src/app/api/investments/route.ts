import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, packageName, investmentAmount } = await request.json();

    const newInvestment = await prisma.investment.create({
      data: {
        packageName,
        investmentAmount,
        user: { connect: { id: userId } },
      },
    });

    // Update user's total investment amount and number of packages invested
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalInvestmentAmount: { increment: investmentAmount },
        numberOfPackagesInvested: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true, investment: newInvestment });
  } catch (error) {
    console.error('Error creating investment:', error);
    return NextResponse.json({ success: false, error: 'Failed to create investment' }, { status: 500 });
  }
}
