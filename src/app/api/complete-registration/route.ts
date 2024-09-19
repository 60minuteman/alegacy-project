import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from '@/lib/authMiddleware';

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
      user = await prisma.user.create({
        data: {
          email: userEmail,
          firstName,
          lastName,
          phoneNumber,
          ravenSessionId: (req as any).sessionId,
          referralCode: await prisma.$queryRaw`SELECT public.generate_referral_code()`,
        },
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { email: userEmail },
        data: {
          firstName,
          lastName,
          phoneNumber,
        },
      });
    }

    // Create new investment record
    if (investmentAmount && packageName) {
      const investment = await prisma.investment.create({
        data: {
          userId: user.id,
          packageName,
          investmentAmount,
          investmentDate: new Date(),
        },
      });

      // Update user's total investment amount and number of packages
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalInvestmentAmount: {
            increment: investmentAmount,
          },
          numberOfPackagesInvested: {
            increment: 1,
          },
        },
      });
    }

    // Fetch updated user data
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { investments: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json({ success: false, message: 'Error processing request' }, { status: 500 });
  }
}

export const POST = authMiddleware(handler);
