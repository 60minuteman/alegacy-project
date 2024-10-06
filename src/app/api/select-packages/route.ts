import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, packageIds, amount } = await req.json();

    const investment = await prisma.investment.create({
      data: {
        userId,
        amount,
        name: `Investment ${Date.now()}`, // You might want to generate a more meaningful name
        status: 'SELECTED',
        packages: {
          connect: packageIds.map((id: string) => ({ id })),
        },
      },
      include: {
        packages: true,
      },
    });

    return NextResponse.json({ success: true, investment });
  } catch (error) {
    console.error('Error selecting packages:', error);
    return NextResponse.json({ success: false, message: 'Error selecting packages' }, { status: 500 });
  }
}
