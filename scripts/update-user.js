const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Update user with ID 2
    const updatedUser = await prisma.user.update({
      where: {
        id: 2
      },
      data: {
        email: 'orcateksolutions@gmail.com',
        password: hashedPassword,
        role: 'admin'
      }
    });
    
    console.log('User updated successfully:', {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUser();
