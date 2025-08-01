'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadFileToBlob, deleteBlobImage, listBlobs } from '@/lib/azure-storage';

// Handle file uploads to Azure Blob Storage
export async function POST(request: NextRequest) {
  // Check admin authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const blobUrl = await uploadFileToBlob(file);
    
    return NextResponse.json({ url: blobUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// List all images in the blob storage
export async function GET() {
  // Check admin authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const blobs = await listBlobs();
    return NextResponse.json(blobs);
  } catch (error) {
    console.error('Error listing blobs:', error);
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    );
  }
}

// Delete an image from blob storage
export async function DELETE(request: NextRequest) {
  // Check admin authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }
    
    await deleteBlobImage(url);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blob:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
