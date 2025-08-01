import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('Testing admin login for:', email);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found',
        email: email 
      });
    }

    // Check password
    const passwordMatch = await compare(password, user.password);

    return NextResponse.json({
      success: passwordMatch,
      message: passwordMatch ? 'Login successful' : 'Invalid password',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      passwordMatch
    });

  } catch (error) {
    console.error('Admin test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Database error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function GET() {
  try {
    // List all users to see what's in the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      users,
      count: users.length
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
