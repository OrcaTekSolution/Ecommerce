import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { prisma } from '@/lib/prisma';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING!
);

// Toggle featured status
export async function PATCH(request: NextRequest) {
  try {
    const { productId, featured } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { featured: featured },
      include: {
        category: true
      }
    });

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// Delete product image
export async function DELETE(request: NextRequest) {
  try {
    const { productId, imageUrl, imageType } = await request.json();

    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: 'Product ID and image URL are required' },
        { status: 400 }
      );
    }

    // Delete from Azure Blob Storage
    try {
      const url = new URL(imageUrl);
      const fileName = url.pathname.substring(url.pathname.indexOf('/', 1) + 1);
      
      const containerClient = blobServiceClient.getContainerClient('ecommerce');
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      
      await blockBlobClient.delete();
    } catch (deleteError) {
      console.error('Error deleting blob:', deleteError);
      // Continue even if blob deletion fails
    }

    // Update product in database
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};

    if (imageType === 'main') {
      updateData.imageUrl = '';
    } else {
      // Remove from additional images
      const existingImages = product.images ? JSON.parse(product.images) : [];
      const filteredImages = existingImages.filter((img: string) => img !== imageUrl);
      updateData.images = JSON.stringify(filteredImages);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: updateData,
      include: {
        category: true
      }
    });

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Error deleting product image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
