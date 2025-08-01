import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data (except users)
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  
  // Create categories
  const newbornCategory = await prisma.category.create({
    data: {
      name: 'Newborn (0-3 months)',
      description: 'Dresses for newborns aged 0-3 months',
      imageUrl: null,
    },
  });
  
  const infantCategory = await prisma.category.create({
    data: {
      name: 'Infant (3-12 months)',
      description: 'Dresses for infants aged 3-12 months',
      imageUrl: null,
    },
  });
  
  const toddlerCategory = await prisma.category.create({
    data: {
      name: 'Toddler (1-3 years)',
      description: 'Dresses for toddlers aged 1-3 years',
      imageUrl: null,
    },
  });
  
  const accessoriesCategory = await prisma.category.create({
    data: {
      name: 'Accessories',
      description: 'Accessories for baby dresses',
      imageUrl: null,
    },
  });
  
  // Create products
  await prisma.product.create({
    data: {
      name: 'Floral Summer Dress',
      description: 'Beautiful floral pattern summer dress, perfect for special occasions.',
      price: 29.99,
      salePrice: null,
      imageUrl: '',
      images: JSON.stringify([]),
      stock: 15,
      featured: true,
      categoryId: newbornCategory.id,
      size: JSON.stringify(['0-3 months']),
      color: JSON.stringify(['Pink', 'Yellow']),
    },
  });
  
  await prisma.product.create({
    data: {
      name: 'Birthday Party Dress',
      description: 'Special dress for birthdays and celebrations.',
      price: 39.99,
      salePrice: 34.99,
      imageUrl: '',
      images: JSON.stringify([]),
      stock: 10,
      featured: true,
      categoryId: infantCategory.id,
      size: JSON.stringify(['6-9 months', '9-12 months']),
      color: JSON.stringify(['White', 'Blue']),
    },
  });
  
  await prisma.product.create({
    data: {
      name: 'Winter Frock',
      description: 'Warm and cozy winter frock for toddlers.',
      price: 49.99,
      salePrice: null,
      imageUrl: '',
      images: JSON.stringify([]),
      stock: 8,
      featured: true,
      categoryId: toddlerCategory.id,
      size: JSON.stringify(['2T', '3T']),
      color: JSON.stringify(['Red', 'Green']),
    },
  });
  
  await prisma.product.create({
    data: {
      name: 'Baby Bow Headband',
      description: 'Cute bow headband to accessorize baby dresses.',
      price: 9.99,
      salePrice: 7.99,
      imageUrl: '',
      images: JSON.stringify([]),
      stock: 25,
      featured: false,
      categoryId: accessoriesCategory.id,
      size: JSON.stringify(['One Size']),
      color: JSON.stringify(['Pink', 'White', 'Blue']),
    },
  });
  
  await prisma.product.create({
    data: {
      name: 'Summer Floral Onesie',
      description: 'Light and breathable summer onesie with floral patterns.',
      price: 19.99,
      salePrice: null,
      imageUrl: '',
      images: JSON.stringify([]),
      stock: 20,
      featured: true,
      categoryId: newbornCategory.id,
      size: JSON.stringify(['0-3 months']),
      color: JSON.stringify(['Pink', 'Yellow']),
    },
  });
  
  // More products here...
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
