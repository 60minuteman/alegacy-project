import { NextResponse } from 'next/server';
import { getOTP } from '../otpStore'; // Assuming you have a function to get the OTP from your store

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    // Retrieve the stored OTP for the given email
    const storedOtp = await getOTP(email);

    if (!storedOtp) {
      return NextResponse.json({ message: 'OTP not found' }, { status: 404 });
    }

    if (storedOtp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    // OTP is valid
    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to verify OTP', details: error.message }, { status: 500 });
  }
}
