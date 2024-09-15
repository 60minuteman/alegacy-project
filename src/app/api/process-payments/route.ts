import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from '@/lib/authMiddleware';

async function handler(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { investmentId, paymentDetails } = await req.json();
    const userId = (req as any).userId;

    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
    });

    if (!investment || investment.userId !== userId) {
      return NextResponse.json({ success: false, message: 'Investment not found or unauthorized' }, { status: 404 });
    }

    const updatedInvestment = await prisma.investment.update({
      where: { id: investmentId },
      data: {
        status: 'PAID',
        paymentDetails: JSON.stringify(paymentDetails),
      },
    });

    return NextResponse.json({ success: true, investment: updatedInvestment });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ success: false, message: 'Error processing payment' }, { status: 500 });
  }
}

export const POST = authMiddleware(handler);
