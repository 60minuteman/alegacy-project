import { NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/authMiddleware';
import { supabase } from '@/lib/supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


const prisma = new PrismaClient();

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
          referralCode: await generateReferralCode(),
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
      await prisma.investment.create({
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

    if (!updatedUser) {
      throw new Error('User not found after update');
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json({ success: false, message: 'Error processing request' }, { status: 500 });
  }
}

async function generateReferralCode() {
  // Implement referral code generation logic here
  // This is a placeholder implementation
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const POST = authMiddleware(handler);
