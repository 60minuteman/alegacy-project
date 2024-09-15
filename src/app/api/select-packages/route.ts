import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from '@/lib/authMiddleware';

async function handler(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { packageIds, amount } = await req.json();
    const userId = (req as any).userId; // This comes from the authMiddleware

    if (!packageIds || !amount || !userId) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const investment = await prisma.investment.create({
      data: {
        userId,
        amount,
        packages: {
          connect: packageIds.map((id: string) => ({ id })),
        },
        status: 'SELECTED',
      },
    });

    return NextResponse.json({ success: true, investmentId: investment.id });
  } catch (error) {
    console.error('Error selecting package:', error);
    return NextResponse.json({ success: false, message: 'Error selecting package' }, { status: 500 });
  }
}

export const POST = authMiddleware(handler);
