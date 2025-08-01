const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('Checking categories in database...');
    
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true
      }
    });
    
    console.log('Categories found:');
    categories.forEach(category => {
      console.log(`- ID: ${category.id}, Name: ${category.name}, ImageUrl: ${category.imageUrl}`);
    });
    
  } catch (error) {
    console.error('Error checking categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
