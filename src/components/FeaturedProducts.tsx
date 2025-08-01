'use client';

// @ts-ignore
import { useState, useEffect } from 'react';
// @ts-ignore
import Link from 'next/link';
// @ts-ignore
import Image from 'next/image';
// @ts-ignore
import { FaShoppingCart } from 'react-icons/fa';
// @ts-ignore
import { useCartStore } from '@/lib/store';
import { staticFeaturedProducts } from '@/lib/staticData';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  imageUrl: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  featured: boolean;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addItem: addToCart } = useCartStore();
  
  // Placeholder products from static data
  const placeholderProducts: Product[] = staticFeaturedProducts.map(product => ({
    ...product,
    featured: true
  }));
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.slice(0, 4)); // Get first 4 featured products
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
        // Use placeholders on error
        setProducts(placeholderProducts);
      }
    };
    
    fetchProducts();
  }, []);
  
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || undefined,
      imageUrl: product.imageUrl,
      quantity: 1
    });
    
    // Show a toast notification or feedback
    alert(`${product.name} added to cart!`);
  };
  
  // If still loading, show placeholders with shimmer effect
  const displayProducts = loading ? placeholderProducts : products.length > 0 ? products : placeholderProducts;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayProducts.map((product) => (
        <div key={product.id} className="card overflow-hidden">
          <div className="relative h-64">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div 
                className={`absolute inset-0 flex items-center justify-center ${loading ? 'animate-pulse' : ''}`}
                style={{
                  backgroundColor: 
                    product.categoryId === 1 ? '#ffcdd2' : // Pink for newborn
                    product.categoryId === 2 ? '#bbdefb' : // Blue for infant
                    product.categoryId === 3 ? '#c8e6c9' : // Green for toddler
                    product.categoryId === 4 ? '#fff9c4' : // Yellow for accessories
                    '#f5f5f5', // Default light gray
                }}
              >
                <div className="text-center p-4">
                  <h3 className="text-lg font-medium text-gray-700">{product.name}</h3>
                </div>
              </div>
            )}
            
            {product.salePrice && (
              <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md">
                Sale!
              </div>
            )}
          </div>
          
          <div className="p-4">
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href={`/categories/${product.categoryId}`}
                className="text-sm text-gray-500 hover:underline"
              >
                {product.category.name}
              </Link>
            </div>
            
            <div className="flex items-center justify-between">
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
              
              <button
                onClick={() => handleAddToCart(product)}
                className="text-dark hover:text-primary transition-colors"
                aria-label={`Add ${product.name} to cart`}
              >
                <FaShoppingCart />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
