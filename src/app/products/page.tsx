'use client';

// @ts-ignore
import { useState, useEffect } from 'react';
// @ts-ignore
import Link from 'next/link';
// @ts-ignore
import Image from 'next/image';
// @ts-ignore
import { FaFilter } from 'react-icons/fa';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  imageUrl: string;
  categoryId: number;
  createdAt: string; // Added createdAt field
  category: {
    id: number;
    name: string;
  };
};

type Category = {
  id: number;
  name: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Placeholder products and categories
  const placeholderProducts: Product[] = Array(12).fill(null).map((_, i) => ({
    id: i + 1,
    name: 'Product Name',
    description: 'Product description',
    price: 29.99,
    imageUrl: null, // Don't try to load non-existent images
    categoryId: 1,
    createdAt: new Date().toISOString(), // Adding createdAt field with current date
    category: { id: 1, name: 'Category' }
  }));
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // Fetch products
        let url = '/api/products';
        const params = new URLSearchParams();
        
        if (selectedCategory !== 'all') {
          params.append('categoryId', selectedCategory);
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const productsResponse = await fetch(url);
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        
        let productsData = await productsResponse.json();
        
        // Sort products
        switch (sortBy) {
          case 'price-low':
            productsData = productsData.sort((a: Product, b: Product) => {
              const aPrice = a.salePrice || a.price;
              const bPrice = b.salePrice || b.price;
              return aPrice - bPrice;
            });
            break;
          case 'price-high':
            productsData = productsData.sort((a: Product, b: Product) => {
              const aPrice = a.salePrice || a.price;
              const bPrice = b.salePrice || b.price;
              return bPrice - aPrice;
            });
            break;
          case 'newest':
            productsData = productsData.sort((a: Product, b: Product) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            break;
          default:
            // Featured or default sorting
            break;
        }
        
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
        setProducts(placeholderProducts); // Use placeholders on error
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCategory, sortBy, searchQuery]);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search query is already set via the input's onChange
    // The useEffect will trigger a new fetch with the updated query
  };
  
  // Display either real products or placeholders during loading
  const displayProducts = loading ? placeholderProducts : products.length > 0 ? products : placeholderProducts;
  
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-heading font-semibold mb-8">All Products</h1>
      
      {/* Mobile filters toggle */}
      <button 
        className="md:hidden flex items-center gap-2 mb-4 text-primary" 
        onClick={toggleFilters}
      >
        <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters and search - always visible on desktop, toggleable on mobile */}
        <div className={`md:w-1/4 lg:w-1/5 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            {/* Search */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Search</h3>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="category-all"
                    type="radio"
                    name="category"
                    value="all"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="mr-2"
                  />
                  <label htmlFor="category-all" className="text-gray-700">
                    All Categories
                  </label>
                </div>
                
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      type="radio"
                      name="category"
                      value={category.id.toString()}
                      checked={selectedCategory === category.id.toString()}
                      onChange={() => setSelectedCategory(category.id.toString())}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sort By */}
            <div>
              <h3 className="font-medium mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input w-full"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="md:w-3/4 lg:w-4/5">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {!loading && products.length === 0 && !error && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
              <p>No products found matching your criteria. Try changing your filters.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="card group">
                <div className="relative h-56 overflow-hidden">
                  <div 
                    className={`absolute inset-0 ${loading ? 'animate-pulse' : ''} group-hover:scale-105`}
                    style={{
                      backgroundColor: 
                        product.categoryId === 1 ? '#ffcdd2' : // Pink for newborn
                        product.categoryId === 2 ? '#bbdefb' : // Blue for infant
                        product.categoryId === 3 ? '#c8e6c9' : // Green for toddler
                        product.categoryId === 4 ? '#fff9c4' : // Yellow for accessories
                        '#f5f5f5', // Default light gray
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.3s',
                    }}
                  >
                    <span className="text-lg font-medium text-gray-600 text-center px-2">{product.name}</span>
                  </div>
                  
                  {product.salePrice && (
                    <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md">
                      Sale!
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="text-sm text-gray-500 mb-2">
                    {product.category.name}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {product.salePrice ? (
                      <>
                        <span className="text-primary font-semibold">${product.salePrice.toFixed(2)}</span>
                        <span className="text-gray-500 text-sm line-through">${product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-primary font-semibold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
