import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { account_number, amount } = await req.json();

    // Find the pending registration
    const pendingRegistration = await prisma.pendingRegistration.findFirst({
      where: { accountNumber: account_number, totalAmount: parseFloat(amount) }
    });

    if (!pendingRegistration) {
      return NextResponse.json({ success: false, message: 'No matching pending registration found' }, { status: 400 });
    }

    // Check if there's a webhook response for this registration
    if (!pendingRegistration.webhookResponse || pendingRegistration.paymentStatus !== 'PAID') {
      return NextResponse.json({ success: false, message: 'Payment not yet verified, please make payment and try again' }, { status: 400 });
    }

    // If webhook response exists and status is PAID, proceed with user creation/update
    let user = await prisma.user.findUnique({ where: { email: pendingRegistration.email } });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { email: pendingRegistration.email },
        data: {
          totalInvestmentAmount: { increment: pendingRegistration.totalAmount },
          numberOfPackagesInvested: { increment: (pendingRegistration.selectedPackages as any[]).length },
        }
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: pendingRegistration.email,
          firstName: pendingRegistration.firstName,
          lastName: pendingRegistration.lastName,
          phoneNumber: pendingRegistration.phoneNumber || '',
          totalInvestmentAmount: pendingRegistration.totalAmount,
          numberOfPackagesInvested: (pendingRegistration.selectedPackages as any[]).length,
          referralCode: pendingRegistration.sessionId || '',
          referralLink: `https://yourdomain.com/register?ref=${pendingRegistration.sessionId || ''}`,
        }
      });
    }

    // Create investments
    const investments = await Promise.all((pendingRegistration.selectedPackages as any[]).map(pkg =>
      prisma.investment.create({
        data: {
          packageName: pkg.packageName || 'Unknown Package',
          investmentAmount: pkg.investmentAmount || 0,
          userId: user.id,
        }
      })
    ));

    console.log('Payment verified successfully');
    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified and user account updated',
      data: { user, investments }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, message: 'An error occurred while verifying payment' }, { status: 500 });
  }
}
