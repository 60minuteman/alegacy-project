// @ts-ignore
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOTP } from '@/utils/otp';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Generate a referral code using the database function
      const referralCode = await prisma.$queryRaw`SELECT public.generate_referral_code()`;

      user = await prisma.user.create({
        data: {
          email,
          firstName: '',  // These can be updated later
          lastName: '',
          phoneNumber: '',
          referralCode: referralCode[0].generate_referral_code,
        }
      });
    }

    const otp = generateOTP(email);

    // Save OTP to the otp_store table
    await prisma.oTPStore.upsert({
      where: { email: user.email },
      update: {
        otp: otp,
        expiryTime: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
      },
      create: {
        email: user.email,
        otp: otp,
        expiryTime: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // In a real-world scenario, you would send the OTP via email here
    console.log(`OTP for ${email}: ${otp}`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in login/signup:', error);
    return NextResponse.json({ success: false, message: 'Error processing request' }, { status: 500 });
  }
}
