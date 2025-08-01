import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProductById } from '@/lib/staticData';

// Get product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // First try to get the product from static data
    // This avoids database connection issues when DB is not available
    const staticProduct = getProductById(id);
    if (staticProduct) {
      console.log('Using static product data for ID:', id);
      return NextResponse.json(staticProduct);
    }
    
    // If not found in static data, try the database
    // But wrap in a timeout to avoid hanging
    const productPromise = prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Database query timed out after 3 seconds'));
      }, 3000); // 3 second timeout
    });
    
    // Race the timeout against the DB query
    const product = await Promise.race([productPromise, timeoutPromise])
      .catch(error => {
        console.error('Database error or timeout:', error);
        return null;
      });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Return static data as fallback
    const staticProduct = getProductById(parseInt(params.id));
    if (staticProduct) {
      console.log('Using static product data as fallback for ID:', params.id);
      return NextResponse.json(staticProduct);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, price, categoryId } = await request.json()
    const productId = parseInt(params.id)

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and categoryId are required' },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        categoryId: parseInt(categoryId)
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    await prisma.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
