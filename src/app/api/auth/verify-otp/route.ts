import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyOtp } from '@/utils/otp';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    const isValid = await verifyOtp(email, otp);

    if (isValid) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      const token = generateToken(user.id);
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in OTP verification:', error);
    return NextResponse.json({ success: false, message: 'Error processing request' }, { status: 500 });
  }
}
