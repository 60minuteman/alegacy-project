import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOtp } from '@/utils/otp';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    await sendOtp(email);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in login/signup:', error);
    return NextResponse.json({ success: false, message: 'Error processing request' }, { status: 500 });
  }
}
