import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { prisma } from '@/lib/prisma';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;
    const imageType = formData.get('imageType') as string; // 'main' or 'additional'

    if (!file || !productId) {
      return NextResponse.json(
        { error: 'File and productId are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `products/${productId}/${imageType}-${Date.now()}.${fileExtension}`;

    // Upload to Azure Blob Storage
    const containerClient = blobServiceClient.getContainerClient('ecommerce');
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    // Get the URL
    const imageUrl = blockBlobClient.url;

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
      updateData.imageUrl = imageUrl;
    } else {
      // Handle additional images
      const existingImages = product.images ? JSON.parse(product.images) : [];
      existingImages.push(imageUrl);
      updateData.images = JSON.stringify(existingImages);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: updateData,
      include: {
        category: true
      }
    });

    return NextResponse.json({ 
      imageUrl,
      product: updatedProduct
    });

  } catch (error) {
    console.error('Error uploading product image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
