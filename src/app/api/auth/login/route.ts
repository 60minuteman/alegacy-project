/// <reference types="react" />

// @ts-nocheck
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log('Login attempt for email:', email);

    let user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      console.log('User not found, creating new user');
      user = await prisma.user.create({
        data: {
          email,
          // Add any other required fields here
        },
      });
    }

    console.log('User found/created:', user);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        // Add any other fields you want to return
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
