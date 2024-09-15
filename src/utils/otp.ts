import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // Configure your email service here
});

export async function sendOtp(email: string): Promise<void> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // In a real application, you would store this OTP securely (e.g., in Redis with an expiration)

  await transporter.sendMail({
    from: 'your-email@example.com',
    to: email,
    subject: 'Your OTP for authentication',
    text: `Your OTP is: ${otp}`,
  });
}

export async function verifyOtp(email: string, otp: string): Promise<boolean> {
  // In a real application, you would verify the OTP against the stored value
  // For this example, we'll always return true
  return true;
}
