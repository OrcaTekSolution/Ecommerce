// This is a dummy/static data file for use when database is not available

export const staticCategories = [
  {
    id: 1,
    name: 'Newborn (0-3 months)',
    description: 'Delicate clothing for your precious newborn, sized for babies 0-3 months.',
    imageUrl: null, // Don't try to load non-existent image
  },
  {
    id: 2,
    name: 'Infant (3-12 months)',
    description: 'Comfortable and cute outfits for your growing baby, sized for 3-12 months.',
    imageUrl: null, // Don't try to load non-existent image
  },
  {
    id: 3,
    name: 'Toddler (1-3 years)',
    description: 'Durable and adorable dresses for your active toddler, sized for children 1-3 years.',
    imageUrl: null, // Don't try to load non-existent image
  },
  {
    id: 4,
    name: 'Accessories',
    description: 'Complete any outfit with our selection of bows, headbands, socks, and more.',
    imageUrl: null, // Don't try to load non-existent image
  },
];

export const staticProducts = [
  {
    id: 1,
    name: 'Floral Summer Dress',
    description: 'A beautiful floral pattern dress perfect for summer days.',
    price: 29.99,
    categoryId: 1,
    imageUrl: null, // Don't try to load non-existent images
    category: { id: 1, name: 'Newborn (0-3 months)' },
  },
  {
    id: 2,
    name: 'Lace Christening Gown',
    description: 'An elegant white christening gown with delicate lace details.',
    price: 49.99,
    categoryId: 1,
    imageUrl: null, // Don't try to load non-existent images
    category: { id: 1, name: 'Newborn (0-3 months)' },
  },
  {
    id: 3,
    name: 'Polka Dot Party Dress',
    description: 'A fun polka dot dress perfect for parties and special occasions.',
    price: 34.99,
    salePrice: 29.99,
    categoryId: 2,
    imageUrl: null, // Don't try to load non-existent images
    category: { id: 2, name: 'Infant (3-12 months)' },
  },
  {
    id: 4,
    name: 'Denim Overall Dress',
    description: 'A cute and practical denim overall dress for everyday wear.',
    price: 27.99,
    categoryId: 2,
    imageUrl: null, // Don't try to load non-existent images
    category: { id: 2, name: 'Infant (3-12 months)' },
  },
  {
    id: 5,
    name: 'Tutu Princess Dress',
    description: 'Make your toddler feel like a princess with this tutu dress.',
    price: 39.99,
    categoryId: 3,
    imageUrl: null, // Don't try to load non-existent images
    category: { id: 3, name: 'Toddler (1-3 years)' },
  },
  {
    id: 6,
    name: 'Butterfly Bow Set',
    description: 'Set of 5 butterfly-themed bows in different colors.',
    price: 14.99,
    categoryId: 4,
    imageUrl: null, // Don't try to load non-existent images
    category: { id: 4, name: 'Accessories' },
  },
  {
    id: 7,
    name: 'Winter Knit Dress',
    description: 'A warm knit dress perfect for winter months.',
    price: 44.99,
    salePrice: 35.99,
    categoryId: 3,
    imageUrl: null, // Don't try to load non-existent images
    category: { id: 3, name: 'Toddler (1-3 years)' },
  },
  {
    id: 8,
    name: 'Floral Headband Set',
    description: 'Set of 3 floral headbands for your little one.',
    price: 19.99,
    categoryId: 4,
    imageUrl: null, // Don't try to load non-existent images
    category: { id: 4, name: 'Accessories' },
  },
];

// Static featured products
export const staticFeaturedProducts = staticProducts.slice(0, 4);

// Function to get products by category ID
export function getProductsByCategory(categoryId: number) {
  return staticProducts.filter(product => product.categoryId === categoryId);
}

// Function to get a category by ID
export function getCategoryById(categoryId: number) {
  return staticCategories.find(category => category.id === categoryId) || null;
}

// Function to get a product by ID
export function getProductById(productId: number) {
  return staticProducts.find(product => product.id === productId) || null;
}
