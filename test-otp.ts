require('module-alias/register');
const prisma = require('@/lib/prisma').default;
const { generateOTP, verifyOtp } = require('./src/utils/otp');

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Query result:', result);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function testOTP() {
  const testEmail = 'test@example.com';
  
  try {
    console.log('Generating OTP...');
    const otp = await generateOTP(testEmail);
    console.log('Generated OTP:', otp);

    // Check if OTP is in the database immediately after generation
    let storedOTP = await prisma.oTPStore.findUnique({
      where: { email: testEmail },
    });
    console.log('Stored OTP in database after generation:', storedOTP);

    console.log('Verifying correct OTP...');
    const isValid = await verifyOtp(testEmail, otp);
    console.log('OTP valid:', isValid);

    // Check if OTP is still in the database after verification
    storedOTP = await prisma.oTPStore.findUnique({
      where: { email: testEmail },
    });
    console.log('Stored OTP in database after verification:', storedOTP);

    console.log('Verifying incorrect OTP...');
    const isInvalid = await verifyOtp(testEmail, '000000');
    console.log('OTP invalid:', !isInvalid);

    // Final check
    storedOTP = await prisma.oTPStore.findUnique({
      where: { email: testEmail },
    });
    console.log('Final stored OTP in database:', storedOTP);
  } catch (error) {
    console.error('Error in testOTP:', error);
  }
}

async function runTests() {
  await testDatabaseConnection();
  await testOTP();
  await prisma.$disconnect();
}

runTests().catch(console.error);
