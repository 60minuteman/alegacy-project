import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { account_number } = await req.json();

    // Fetch the pending registration
    const pendingRegistration = await prisma.pendingRegistration.findUnique({
      where: { accountNumber: account_number }
    });

    if (!pendingRegistration) {
      return NextResponse.json({ status: 'error', message: 'No pending registration found' }, { status: 400 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email: pendingRegistration.email } });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: pendingRegistration.email,
          phoneNumber: pendingRegistration.phoneNumber,
          firstName: pendingRegistration.firstName,
          lastName: pendingRegistration.lastName,
          totalInvestmentAmount: pendingRegistration.totalAmount,
        }
      });
    } else {
      // Update existing user's total investment amount
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          totalInvestmentAmount: {
            increment: pendingRegistration.totalAmount
          }
        }
      });
    }

    // Create investments
    const selectedPackages = pendingRegistration.selectedPackages as { packageName: string, investmentAmount: number }[];
    const investments = await Promise.all(selectedPackages.map(pkg =>
      prisma.investment.create({
        data: {
          packageName: pkg.packageName,
          investmentAmount: pkg.investmentAmount,
          userId: user.id
        }
      })
    ));

    // Delete the pending registration
    await prisma.pendingRegistration.delete({ where: { id: pendingRegistration.id } });

    return NextResponse.json({ 
      status: 'success', 
      data: { 
        user,
        investments 
      }
    });
  } catch (error) {
    console.error('Error creating user and investments:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to create user and investments' }, { status: 500 });
  }
}
