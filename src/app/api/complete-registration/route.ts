import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from '@/lib/authMiddleware';

async function handler(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { investmentId, ...userData } = await req.json();
    const userId = (req as any).userId;

    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
    });

    if (!investment || investment.userId !== userId) {
      return NextResponse.json({ success: false, message: 'Investment not found or unauthorized' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...userData,
        registrationCompleted: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json({ success: false, message: 'Error completing registration' }, { status: 500 });
  }
}

export const POST = authMiddleware(handler);
