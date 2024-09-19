import { NextResponse } from 'next/server';
import { saveOTP } from '../otpStore';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createTransporter() {
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      accessToken,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN
    }
  });

  return transporter;
}

async function sendEmail(to: string, otp: string) {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to,
    subject: 'Your OTP for Melfi Technology',
    html: `
      <h1>Your OTP for Melfi Technology</h1>
      <p>Your One-Time Password is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const otp = generateOTP();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Store OTP
    await saveOTP(email, otp);

    console.log('Attempting to send email...');
    await sendEmail(email, otp);
    console.log('Email sent successfully');

    console.log('\n--- OTP Email Sent ---');
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log('----------------------\n');

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in send-otp API route:', error);
    return NextResponse.json({ error: 'Failed to send OTP', details: error.message }, { status: 500 });
  }
}
