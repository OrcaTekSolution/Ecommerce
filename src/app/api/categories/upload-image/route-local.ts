import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const categoryId = formData.get('categoryId') as string

    if (!file || !categoryId) {
      return NextResponse.json(
        { error: 'Missing file or categoryId' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileName = `category-${categoryId}-${Date.now()}-${file.name.replace(/\s/g, '-')}`
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    
    try {
      // Try to create directory (will fail silently if it exists)
      await writeFile(join(uploadsDir, '.gitkeep'), '')
    } catch {
      // Directory might already exist, that's fine
    }

    // Save file locally
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // Create public URL
    const imageUrl = `/uploads/${fileName}`

    // Update category in database
    await prisma.category.update({
      where: { id: parseInt(categoryId) },
      data: { imageUrl }
    })

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
