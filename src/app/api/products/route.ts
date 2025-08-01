import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { staticProducts, staticFeaturedProducts, getProductsByCategory } from '@/lib/staticData';

// Get all products with optional filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Extract query parameters
  const categoryId = searchParams.get('categoryId');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');
  
  try {
    // Build filter object
    const filter: any = {};
    
    if (categoryId) {
      filter.categoryId = parseInt(categoryId);
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Query products
    const products = await prisma.product.findMany({
      where: filter,
      include: {
        category: true
      }
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return static data instead of an error
    if (featured === 'true') {
      return NextResponse.json(staticFeaturedProducts);
    }
    
    if (categoryId) {
      const filteredProducts = getProductsByCategory(parseInt(categoryId));
      return NextResponse.json(filteredProducts);
    }
    
    // Return all static products if no filters
    return NextResponse.json(staticProducts);
  }
}

// Create new product
export async function POST(request: NextRequest) {
  try {
    const { name, description, price, categoryId } = await request.json()

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and categoryId are required' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        imageUrl: '', // Default empty string since it's required
        categoryId: parseInt(categoryId)
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
