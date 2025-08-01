import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST() {
  try {
    // Find the admin user
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'orcateksolutions@gmail.com'
      }
    });

    if (!adminUser) {
      return NextResponse.json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Hash the new password
    const newPassword = 'admin123';
    const hashedPassword = await hash(newPassword, 12);

    // Update the user with new password and ensure role is correct
    const updatedUser = await prisma.user.update({
      where: {
        email: 'orcateksolutions@gmail.com'
      },
      data: {
        password: hashedPassword,
        role: 'ADMIN' // Ensure role is ADMIN (uppercase)
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin password reset successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Error resetting admin password:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to reset admin password',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function GET() {
  try {
    // Check admin user details
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'orcateksolutions@gmail.com'
      },
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
      admin: adminUser
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
