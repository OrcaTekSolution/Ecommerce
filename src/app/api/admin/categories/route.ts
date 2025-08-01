'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Create a new category
export async function POST(request: NextRequest) {
  // Check admin authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { name, description, imageUrl } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // Check if category with same name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }
    
    // Create new category
    const category = await prisma.category.create({
      data: {
        name,
        description,
        imageUrl,
      },
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
