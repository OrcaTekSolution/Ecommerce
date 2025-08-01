const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Checking users and their roles...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    });
    
    console.log('\nUsers in database:');
    console.log(JSON.stringify(users, null, 2));
    
    if (users.length === 0) {
      console.log('\n❌ No users found in database!');
      console.log('This is why login is failing - no admin user exists.');
    } else {
      console.log('\n📊 Role Summary:');
      users.forEach(user => {
        console.log(`- ${user.email}: ${user.role} (${typeof user.role})`);
      });
      
      const adminUsers = users.filter(u => u.role === 'ADMIN');
      const adminUsersLower = users.filter(u => u.role === 'admin');
      
      console.log(`\nADMIN (uppercase): ${adminUsers.length}`);
      console.log(`admin (lowercase): ${adminUsersLower.length}`);
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
