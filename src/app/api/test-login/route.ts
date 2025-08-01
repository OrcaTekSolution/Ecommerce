import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

export async function POST() {
  try {
    const email = 'orcateksolutions@gmail.com';
    const password = 'admin123';

    console.log('Testing login for:', email);

    // Step 1: Find user
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        step: 'user_lookup',
        message: 'User not found',
        email: email
      });
    }

    console.log('User found:', { id: user.id, email: user.email, role: user.role });

    // Step 2: Check password
    const passwordMatch = await compare(password, user.password);
    console.log('Password match:', passwordMatch);

    // Step 3: Check role
    const hasAdminRole = user.role === 'admin' || user.role === 'ADMIN';
    console.log('Has admin role:', hasAdminRole, 'Role:', user.role);

    return NextResponse.json({
      success: passwordMatch && hasAdminRole,
      step: 'complete',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      checks: {
        userFound: true,
        passwordMatch: passwordMatch,
        hasAdminRole: hasAdminRole,
        roleValue: user.role
      },
      message: passwordMatch ? 
        (hasAdminRole ? 'Login should work' : 'User found but not admin role') : 
        'Invalid password'
    });

  } catch (error) {
    console.error('Login test error:', error);
    return NextResponse.json({
      success: false,
      step: 'error',
      message: 'Database error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
