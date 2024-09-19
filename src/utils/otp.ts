const prismaClient = require('@/lib/prisma').default;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure your email service here
});

async function sendOtpInternal(email) {
  const otp = await generateOTPInternal(email);

  await transporter.sendMail({
    from: 'your-email@example.com',
    to: email,
    subject: 'Your OTP for authentication',
    text: `Your OTP is: ${otp}`,
  });
}

async function verifyOtpInternal(email, otp) {
  try {
    console.log(`Attempting to verify OTP for email: ${email}`);
    const storedOtp = await prismaClient.oTPStore.findUnique({
      where: { email },
    });
    console.log('Stored OTP:', storedOtp);

    if (!storedOtp) {
      console.log('No OTP found for email:', email);
      return false;
    }

    if (new Date() > storedOtp.expiryTime) {
      console.log('OTP expired');
      await prismaClient.oTPStore.delete({ where: { email } });
      return false;
    }

    if (storedOtp.otp === otp) {
      console.log('OTP matched');
      await prismaClient.oTPStore.delete({ where: { email } });
      return true;
    }

    console.log('OTP did not match');
    return false;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}

async function generateOTPInternal(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  try {
    console.log(`Attempting to store OTP for email: ${email}`);
    const result = await prismaClient.oTPStore.upsert({
      where: { email },
      update: { otp, expiryTime },
      create: { email, otp, expiryTime },
    });
    console.log('OTP stored in database:', result);
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw error;
  }

  console.log(`OTP for ${email}: ${otp}`);

  return otp;
}

module.exports = {
  sendOtp: sendOtpInternal,
  verifyOtp: verifyOtpInternal,
  generateOTP: generateOTPInternal,
};
