const otpStore = new Map<string, string>();

export async function saveOTP(email: string, otp: string) {
  otpStore.set(email, otp);
}

export async function getOTP(email: string) {
  return otpStore.get(email);
}

export async function deleteOTP(email: string) {
  try {
    await prisma.oTPStore.delete({
      where: { email },
    });
    console.log('OTP deleted for email:', email);
  } catch (error) {
    console.error('Error deleting OTP:', error);
    throw error;
  }
}

export function isOTPValid(otpRecord: { otp: string, expiryTime: Date } | null, providedOTP: string): boolean {
  if (!otpRecord) {
    console.log('No OTP record found');
    return false;
  }
  
  const currentTime = new Date();
  const isExpired = currentTime > otpRecord.expiryTime;
  const isMatching = otpRecord.otp === providedOTP;

  console.log('OTP validation:', {
    currentTime,
    expiryTime: otpRecord.expiryTime,
    isExpired,
    isMatching,
    storedOTP: otpRecord.otp,
    providedOTP
  });

  return !isExpired && isMatching;
}

export async function verifyAndDeleteOTP(email: string, providedOTP: string): Promise<boolean> {
  try {
    console.log(`Attempting to verify OTP for email: ${email}`);
    console.log(`Provided OTP: ${providedOTP}`);

    const otpRecord = await getOTP(email);
    console.log('Retrieved OTP record:', otpRecord);

    if (!otpRecord) {
      console.log('No OTP record found for email:', email);
      return false;
    }

    const currentTime = new Date();
    console.log('Current time:', currentTime);
    console.log('OTP expiry time:', otpRecord.expiryTime);

    const isExpired = currentTime > otpRecord.expiryTime;
    console.log('Is OTP expired?', isExpired);

    const isMatching = otpRecord.otp === providedOTP;
    console.log('Does OTP match?', isMatching);

    const isValid = !isExpired && isMatching;
    console.log('Is OTP valid?', isValid);

    if (isValid) {
      await deleteOTP(email);
      console.log('OTP verified and deleted for email:', email);
    } else {
      console.log('OTP verification failed for email:', email);
    }

    return isValid;
  } catch (error) {
    console.error('Error in verifyAndDeleteOTP:', error);
    // Log the full error stack trace
    console.error(error.stack);
    throw error; // Re-throw the error to be caught in the route handler
  }
}
