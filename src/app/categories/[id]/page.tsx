'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';
import { getCategoryById, getProductsByCategory } from '@/lib/staticData';

type Category = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  imageUrl: string;
  categoryId: number;
  createdAt?: string; // Optional createdAt field for sorting
  category: {
    id: number;
    name: string;
  };
};

export default function CategoryPage() {
  const params = useParams();
  const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);
  
  // Placeholder products for loading state
  const placeholderProducts: Product[] = Array(8).fill(null).map((_, i) => ({
    id: i + 1,
    name: 'Product Name',
    description: 'Product description',
    price: 29.99,
    imageUrl: null,
    categoryId: parseInt(categoryId),
    category: { id: parseInt(categoryId), name: 'Category' }
  }));
  
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        
        // Attempt to fetch the category, but fallback to static data if it fails
        try {
          const categoryResponse = await fetch(`/api/categories/${categoryId}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCategory(categoryData);
          } else {
            throw new Error('Category fetch failed');
          }
        } catch (err) {
          console.error('Error fetching category:', err);
          // Use static data as fallback
          const staticCategory = getCategoryById(parseInt(categoryId as string));
          if (staticCategory) {
            setCategory(staticCategory);
          } else {
            // If not in static data, use default based on ID
            setCategory({
              id: parseInt(categoryId as string),
              name: categoryId === '1' ? 'Newborn' :
                    categoryId === '2' ? 'Infant' :
                    categoryId === '3' ? 'Toddler' :
                    categoryId === '4' ? 'Accessories' : 'Category',
              description: 'Category for babies and children',
              imageUrl: null // Don't try to load non-existent images
            });
          }
        }
        
        // Try to fetch products, but fallback to static data if it fails
        try {
          const productsResponse = await fetch(`/api/products?categoryId=${categoryId}`);
          if (productsResponse.ok) {
            let productsData = await productsResponse.json();
            
            // Sort products
            switch (sortBy) {
              case 'price-low':
                productsData.sort((a: Product, b: Product) => {
                  const aPrice = a.salePrice || a.price;
                  const bPrice = b.salePrice || b.price;
                  return aPrice - bPrice;
                });
                break;
              case 'price-high':
                productsData.sort((a: Product, b: Product) => {
                  const aPrice = a.salePrice || a.price;
                  const bPrice = b.salePrice || b.price;
                  return bPrice - aPrice;
                });
                break;
              case 'newest':
                productsData.sort((a: Product, b: Product) => {
                  // Assuming products have a createdAt field
                  return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                });
                break;
              default:
                // Featured or default sorting
                break;
            }
            
            setProducts(productsData);
          } else {
            throw new Error('Products fetch failed');
          }
        } catch (err) {
          console.error('Error fetching products:', err);
          // Use static data as fallback
          let staticProductsData = getProductsByCategory(parseInt(categoryId as string));
          
          // Sort products
          switch (sortBy) {
            case 'price-low':
              staticProductsData.sort((a, b) => {
                const aPrice = a.salePrice || a.price;
                const bPrice = b.salePrice || b.price;
                return aPrice - bPrice;
              });
              break;
            case 'price-high':
              staticProductsData.sort((a, b) => {
                const aPrice = a.salePrice || a.price;
                const bPrice = b.salePrice || b.price;
                return bPrice - aPrice;
              });
              break;
            default:
              break;
          }
          
          setProducts(staticProductsData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchCategoryAndProducts:', err);
        setError('Failed to load category and products. Please try again later.');
        setLoading(false);
      }
    };
    
    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId, sortBy]);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Display either real products or placeholders during loading
  const displayProducts = loading ? placeholderProducts : products.length > 0 ? products : [];
  
  // Use placeholders for category name/image if loading or error
  const categoryName = category?.name || (
    categoryId === '1' ? 'Newborn' :
    categoryId === '2' ? 'Infant' :
    categoryId === '3' ? 'Toddler' :
    categoryId === '4' ? 'Accessories' :
    categoryId === '5' ? 'Preschooler' :
    categoryId === '6' ? 'School Age' :
    categoryId === '7' ? 'Special Occasions' :
    categoryId === '8' ? 'Seasonal' : 'Category'
  );
  
  return (
    <div className="container mx-auto py-16 px-4">
      <Link href="/categories" className="flex items-center text-primary hover:underline mb-8">
        <FaArrowLeft className="mr-1" /> Back to Categories
      </Link>
      
      <h1 className="text-3xl font-heading font-semibold mb-4">{categoryName}</h1>
      
      {category?.description && (
        <p className="text-gray-600 mb-8 max-w-3xl">{category.description}</p>
      )}
      
      {/* Category image banner */}
      {!loading && (
        <div className="relative h-64 md:h-80 w-full mb-12 rounded-lg overflow-hidden">
          {/* Replace Image with a div background for now since we're having image issues */}
          <div 
            className="absolute inset-0 bg-gray-300"
            style={{
              backgroundColor: categoryId === '1' ? '#ffcdd2' : // Pink for newborn
                              categoryId === '2' ? '#bbdefb' : // Blue for infant
                              categoryId === '3' ? '#c8e6c9' : // Green for toddler
                              categoryId === '4' ? '#fff9c4' : // Yellow for accessories
                              '#e0e0e0' // Default gray
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center p-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-white max-w-md">
              {category?.name || categoryName} Collection
            </h2>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Mobile filters toggle */}
      <button 
        className="md:hidden flex items-center gap-2 mb-4 text-primary" 
        onClick={toggleFilters}
      >
        <FiFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - always visible on desktop, toggleable on mobile */}
        <div className={`md:w-1/4 lg:w-1/5 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
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
            
            {/* Additional filters could be added here */}
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="md:w-3/4 lg:w-4/5">
          {!loading && products.length === 0 && !error && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
              <p>No products found in this category yet. Check back soon!</p>
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
