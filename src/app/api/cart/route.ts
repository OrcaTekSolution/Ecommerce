// @ts-ignore
import { NextResponse } from 'next/server';
// @ts-ignore
import { prisma } from '@/lib/prisma';
// @ts-ignore
import { getServerSession } from 'next-auth/next';
// @ts-ignore
import { authOptions } from '@/lib/auth';

// Add item to cart
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { productId, quantity, size, color } = await request.json();
    const userId = parseInt(session.user.id);
    
    // Get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }
    
    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        size,
        color,
      },
    });
    
    if (existingItem) {
      // Update quantity if already in cart
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item to cart
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size,
          color,
        },
      });
    }
    
    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// Get cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = parseInt(session.user.id);
    
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    if (!cart) {
      // Return empty cart if not found
      return NextResponse.json({ id: null, userId, items: [] });
    }
    
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}
