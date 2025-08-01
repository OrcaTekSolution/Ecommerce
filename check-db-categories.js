const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('Checking database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Present' : 'Missing');
    
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true
      }
    });
    
    console.log('\nCategories in database:');
    console.log(JSON.stringify(categories, null, 2));
    
    if (categories.length === 0) {
      console.log('\n⚠️  No categories found in database');
    } else {
      const withImages = categories.filter(c => c.imageUrl);
      const withoutImages = categories.filter(c => !c.imageUrl);
      
      console.log(`\n📊 Summary:`);
      console.log(`Total categories: ${categories.length}`);
      console.log(`With images: ${withImages.length}`);
      console.log(`Without images: ${withoutImages.length}`);
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('\n🔧 This might be why your deployed app is not showing images');
    console.log('Check your DATABASE_URL in Vercel environment variables');
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
