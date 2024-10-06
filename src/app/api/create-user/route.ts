import { NextResponse } from 'next/server';
// Prisma import removed as per instructions

export async function GET() {
  try {
    // Fetch all pending registrations with PAID status
    const paidRegistrations = await prisma.pendingRegistration.findMany({
      where: { paymentStatus: 'PAID' }
    });

    const results = [];

    for (const registration of paidRegistrations) {
      // Check if user already exists
      let user = await prisma.user.findUnique({ where: { email: registration.email } });

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: registration.email,
            phoneNumber: registration.phoneNumber,
            firstName: registration.firstName,
            lastName: registration.lastName,
            totalInvestmentAmount: registration.totalAmount,
            numberOfPackagesInvested: (registration.selectedPackages as any[]).length,
            role: "USER",
          }
        });
      } else {
        // Update existing user's investment details
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            totalInvestmentAmount: {
              increment: registration.totalAmount
            },
            numberOfPackagesInvested: {
              increment: (registration.selectedPackages as any[]).length
            }
          }
        });
      }

      // Create investments
      const selectedPackages = registration.selectedPackages as { packageName: string, investmentAmount: number }[];
      const investments = await Promise.all(selectedPackages.map(pkg =>
        prisma.investment.create({
          data: {
            packageName: pkg.packageName,
            investmentAmount: pkg.investmentAmount,
            userId: user.id
          }
        })
      ));

      // Delete the pending registration
      await prisma.pendingRegistration.delete({ where: { id: registration.id } });

      results.push({ user, investments });
    }

    return NextResponse.json({ 
      status: 'success', 
      data: results
    });
  } catch (error) {
    console.error('Error processing pending registrations:', error);
    let errorMessage = 'Failed to process pending registrations';
    if (error instanceof Error) {
      errorMessage += ': ' + error.message;
    }
    return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
  }
}
