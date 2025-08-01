'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCartStore } from '@/lib/store';
import { getProductById, getCategoryById } from '@/lib/staticData';
import PlaceholderImage from '@/components/PlaceholderImage';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  imageUrl: string;
  images?: string | null; // Additional images as JSON array
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  size?: string | null; // Size options as JSON array
  color?: string | null; // Color options as JSON array
  stock: number;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  
  // Access the store methods
  const { addItem } = useCartStore();
  
  // State for parsed options
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Safely parse JSON strings with error handling
  const safeParseJSON = (jsonString: string | null | undefined): string[] => {
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return [];
    }
  };
  
  useEffect(() => {
    // Keep track of whether this component is still mounted
    let isMounted = true;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Add a timeout to the fetch to prevent infinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`/api/products/${productId}`, {
          signal: controller.signal,
          // Add a cache control header to prevent repeated fetching
          headers: {
            'Cache-Control': 'no-cache'
          }
        }).catch(err => {
          console.error("Fetch aborted or timed out:", err);
          return null;
        });
        
        // Clear the timeout if fetch completed
        clearTimeout(timeoutId);
        
        // Don't update state if the component has unmounted
        if (!isMounted) return;
        
        // If response is null (fetch was aborted or failed) or not ok, use static data
        if (!response || !response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Parse and set size options
        const parsedSizes = safeParseJSON(data.size);
        setSizeOptions(parsedSizes);
        if (parsedSizes.length > 0) {
          setSelectedSize(parsedSizes[0]);
        }
        
        // Parse and set color options
        const parsedColors = safeParseJSON(data.color);
        setColorOptions(parsedColors);
        if (parsedColors.length > 0) {
          setSelectedColor(parsedColors[0]);
        }
        
        // Parse additional images but filter out any that contain '/images/' paths
        const parsedImages = safeParseJSON(data.images);
        // Only use valid URLs that don't contain '/images/' path (which we know don't exist)
        const filteredImages = parsedImages.filter(img => 
          img && typeof img === 'string' && !img.includes('/images/')
        );
        setAdditionalImages(filteredImages);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        
        // Try to get product from static data if API fails
        const staticProduct = getProductById(parseInt(productId as string));
        if (staticProduct) {
          console.log("Using static product data:", staticProduct);
          // Create a complete product object with all required fields
          const completeProduct = {
            ...staticProduct,
            id: parseInt(productId as string),
            stock: 10, // Default stock value
            images: '[]', // Empty array for images to avoid issues
            size: JSON.stringify(['0-3M', '3-6M', '6-12M']), // Default sizes
            color: JSON.stringify(['Pink', 'Blue', 'White']), // Default colors
            category: staticProduct.category || { 
              id: staticProduct.categoryId, 
              name: getCategoryById(staticProduct.categoryId)?.name || 'Unknown Category'
            }
          };
          
          setProduct(completeProduct);
          
          // Parse and set size options
          setSizeOptions(['0-3M', '3-6M', '6-12M']);
          setSelectedSize('0-3M');
          
          // Parse and set color options
          setColorOptions(['Pink', 'Blue', 'White']);
          setSelectedColor('Pink');
          
          setLoading(false);
        } else {
          setError('Failed to load product. Please try again later.');
          setLoading(false);
        }
      }
    };
    
    if (productId) {
      fetchProduct();
    }
    
    // Cleanup function to prevent setting state after unmounting
    return () => {
      isMounted = false;
    };
  }, [productId]); // Removed safeParseJSON from dependencies to prevent re-fetching
  
  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice || undefined,
        imageUrl: product.imageUrl, // No fallback needed with our colored blocks approach
        quantity,
        size: selectedSize,
        color: selectedColor
      });
      
      // Show a toast notification or feedback
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="md:w-1/2 bg-gray-300 h-96 rounded"></div>
          <div className="md:w-1/2">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-6"></div>
            <div className="h-10 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error || 'Product not found'}</p>
        </div>
        <Link href="/products" className="flex items-center text-primary hover:underline">
          <FaArrowLeft className="mr-1" /> Back to Products
        </Link>
      </div>
    );
  }
  
  // Don't use image paths that contain '/images/' since we know they don't exist
  const isValidImagePath = (path: string | null): boolean => 
    path !== null && !path.includes('/images/');
  
  // Only use the selected image or product imageUrl if they're valid paths
  const displayImage = 
    (selectedImage && isValidImagePath(selectedImage)) ? 
      selectedImage : 
      (product.imageUrl && isValidImagePath(product.imageUrl)) ? 
        product.imageUrl : 
        null;
  
  return (
    <div className="container mx-auto py-16 px-4">
      <Link href="/products" className="flex items-center text-primary hover:underline mb-8">
        <FaArrowLeft className="mr-1" /> Back to Products
      </Link>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="relative h-96 bg-white rounded-lg overflow-hidden mb-4">
            {/* Use the PlaceholderImage component instead of direct styling */}
            <PlaceholderImage 
              categoryId={product.categoryId}
              className="absolute inset-0"
              name={product.name}
            />
          </div>
          
          {/* Thumbnail Gallery - use colored squares instead of actual images */}
          {(additionalImages.length > 0 || product.imageUrl) && (
            <div className="grid grid-cols-5 gap-2">
              <button
                className={`relative h-20 border rounded-md overflow-hidden ${
                  !selectedImage ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedImage(null)}
              >
                <PlaceholderImage
                  categoryId={product.categoryId}
                  className="absolute inset-0"
                  name="Main"
                />
              </button>
              
              {additionalImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-20 border rounded-md overflow-hidden ${
                    selectedImage === image ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <PlaceholderImage
                    categoryId={(product.categoryId + index) % 5}
                    className="absolute inset-0"
                    name={`#${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-heading font-semibold mb-2">{product.name}</h1>
          
          <div className="mb-4">
            <Link href={`/categories/${product.categoryId}`} className="text-primary hover:underline">
              {product.category.name}
            </Link>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-semibold text-primary">${product.salePrice.toFixed(2)}</span>
                <span className="text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                  Save ${(product.price - product.salePrice).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="prose max-w-none mb-8">
            <p>{product.description}</p>
          </div>
          
          {/* Size Options */}
          {sizeOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Size:</h3>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Color Options */}
          {colorOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Color:</h3>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity and Add to Cart */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border rounded-md px-3 py-2"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="btn btn-primary flex-grow sm:flex-grow-0 flex items-center justify-center gap-2"
              disabled={product.stock <= 0}
            >
              <FaShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
          
          {/* Stock Status */}
          <div className="mt-4">
            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Related Products would go here */}
    </div>
  );
}
