import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ status: 'error', message: 'Email is required' }, { status: 400 });
  }

  try {
    const pendingRegistration = await prisma.pendingRegistration.findUnique({
      where: { email },
      select: {
        id: true,
        accountNumber: true,
        paymentVerified: true,
      },
    });

    if (!pendingRegistration) {
      return NextResponse.json({ status: 'error', message: 'No pending registration found for this email' }, { status: 404 });
    }

    if (pendingRegistration.paymentVerified) {
      return NextResponse.json({ status: 'error', message: 'Payment already verified for this registration' }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      data: {
        id: pendingRegistration.id,
        accountNumber: pendingRegistration.accountNumber,
      },
    });
  } catch (error) {
    console.error('Error fetching pending registration:', error);
    return NextResponse.json({ status: 'error', message: 'An error occurred while fetching pending registration' }, { status: 500 });
  }
}