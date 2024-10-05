import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function processPendingRegistrations() {
  try {
    const paidRegistrations = await prisma.pendingRegistration.findMany({
      where: { paymentStatus: 'PAID' }
    });

    console.log(`Found ${paidRegistrations.length} paid registrations`);

    const results = [];

    for (const registration of paidRegistrations) {
      console.log(`Processing registration for email: ${registration.email}`);
      
      let user = await prisma.user.findUnique({ where: { email: registration.email } });

      if (!user) {
        console.log(`Creating new user for email: ${registration.email}`);
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
        console.log(`Updating existing user for email: ${registration.email}`);
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

      console.log(`Creating investments for user: ${user.email}`);
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

      console.log(`Deleting pending registration for email: ${registration.email}`);
      await prisma.pendingRegistration.delete({ where: { id: registration.id } });

      results.push({ user, investments });
    }

    return results;
  } catch (error) {
    console.error('Error processing pending registrations:', error);
    throw error;
  }
}

export async function GET(req: Request) {
  try {
    console.log('Processing pending registrations');
    const results = await processPendingRegistrations();
    console.log('Finished processing pending registrations');
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