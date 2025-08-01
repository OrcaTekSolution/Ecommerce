import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCategoryById } from '@/lib/staticData';

// Get category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    
    if (!category) {
      // Try to find in static data before returning 404
      const staticCategory = getCategoryById(categoryId);
      if (staticCategory) {
        return NextResponse.json(staticCategory);
      }
      
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    // Return static data instead of an error
    const staticCategory = getCategoryById(parseInt(params.id));
    if (staticCategory) {
      return NextResponse.json(staticCategory);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json()
    const categoryId = parseInt(params.id)

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id)

    // Delete all products in this category first
    await prisma.product.deleteMany({
      where: { categoryId }
    })

    // Then delete the category
    await prisma.category.delete({
      where: { id: categoryId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
