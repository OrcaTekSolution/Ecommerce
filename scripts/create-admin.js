const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@tinythreads.com' }
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@tinythreads.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('Admin user created successfully:', adminUser.email)
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
