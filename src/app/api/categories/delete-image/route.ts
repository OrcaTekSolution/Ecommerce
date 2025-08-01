import { NextRequest, NextResponse } from 'next/server'
import { deleteBlobImage } from '@/lib/azure-storage'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { categoryId } = await request.json()

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Missing categoryId' },
        { status: 400 }
      )
    }

    // Get current category to find image URL
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    })

    if (!category || !category.imageUrl) {
      return NextResponse.json(
        { error: 'Category or image not found' },
        { status: 404 }
      )
    }

    // Delete from Azure Blob Storage
    await deleteBlobImage(category.imageUrl)

    // Update category in database
    await prisma.category.update({
      where: { id: parseInt(categoryId) },
      data: { imageUrl: null }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
