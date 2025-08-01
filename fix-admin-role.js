const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function updateAdminRole() {
  try {
    console.log('Updating admin user role to uppercase...');
    
    const result = await prisma.user.update({
      where: {
        email: 'orcateksolutions@gmail.com'
      },
      data: {
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Successfully updated user role:');
    console.log(`- Email: ${result.email}`);
    console.log(`- Role: ${result.role}`);
    console.log('\nNow you can login with:');
    console.log('Email: orcateksolutions@gmail.com');
    console.log('Password: [your password]');
    
  } catch (error) {
    console.error('❌ Error updating user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminRole();
