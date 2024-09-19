import prisma from '@/lib/prisma';

// Simple function to generate a referral code
function generateReferralCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function createUserFromPendingRegistration(email: string) {
  try {
    // Fetch the pending registration
    const pendingRegistration = await prisma.pendingRegistration.findUnique({
      where: { email }
    });

    if (!pendingRegistration) {
      throw new Error('No pending registration found for this email');
    }

    if (!pendingRegistration.paymentVerified) {
      throw new Error('Payment has not been verified for this registration');
    }

    // Generate referral code and link
    const referralCode = generateReferralCode();
    const referralLink = `https://yourdomain.com/register?ref=${referralCode}`;

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email: pendingRegistration.email,
        firstName: pendingRegistration.firstName,
        lastName: pendingRegistration.lastName,
        phoneNumber: pendingRegistration.phone,
        referralCode,
        referralLink,
        totalInvestmentAmount: pendingRegistration.amount,
        numberOfPackagesInvested: 1, // Assuming this is their first investment
        ravenSessionId: pendingRegistration.sessionId,
        referredByCode: pendingRegistration.referredByCode
      }
    });

    // Delete the pending registration
    await prisma.pendingRegistration.delete({
      where: { email }
    });

    console.log('User created successfully:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user from pending registration:', error);
    throw error;
  }
}
