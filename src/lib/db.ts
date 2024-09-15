import prisma from './prisma'

export async function getUserData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        investments: true,
        referrals: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const totalInvestment = user.investments.reduce((sum, investment) => sum + investment.amount, 0);

    const referralLink = `https://yourdomain.com/refer/${user.id}`;

    // Calculate next payment date (example: 30 days from the latest investment)
    const latestInvestment = user.investments.reduce((latest, current) => 
      latest.createdAt > current.createdAt ? latest : current
    );
    const nextPaymentDate = new Date(latestInvestment.createdAt);
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
    const nextPaymentCountdown = getCountdown(nextPaymentDate);

    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      totalInvestment,
      referrals: user.referrals.length,
      referralLink,
      nextPaymentCountdown,
      investments: user.investments.map(investment => ({
        name: investment.name,
        amount: investment.amount,
        date: investment.createdAt.toISOString().split('T')[0],
      })),
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

function getCountdown(date: Date): string {
  const now = new Date();
  const difference = date.getTime() - now.getTime();
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}