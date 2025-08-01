'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Category = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Placeholder categories for babies and children up to 10 years
  const placeholderCategories: Category[] = [
    { id: 1, name: 'Newborn (0-3 months)', imageUrl: null, description: 'Clothing and accessories for newborns' },
    { id: 2, name: 'Infant (3-12 months)', imageUrl: null, description: 'Outfits for babies between 3-12 months' },
    { id: 3, name: 'Toddler (1-3 years)', imageUrl: null, description: 'Cute and comfortable clothes for toddlers' },
    { id: 4, name: 'Preschooler (3-5 years)', imageUrl: null, description: 'Stylish options for preschool children' },
    { id: 5, name: 'School Age (5-10 years)', imageUrl: null, description: 'Perfect outfits for early school years' },
    { id: 6, name: 'Accessories', imageUrl: null, description: 'Hats, socks, shoes, and more' },
    { id: 7, name: 'Special Occasions', imageUrl: null, description: 'Dresses and outfits for birthdays and holidays' },
    { id: 8, name: 'Seasonal', imageUrl: null, description: 'Weather-appropriate clothing for all seasons' },
  ];
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Using placeholder data instead.');
        // Use placeholders on error
        setCategories(placeholderCategories);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // If still loading, show placeholders with shimmer effect
  const displayCategories = loading ? placeholderCategories : 
                           categories.length > 0 ? categories : placeholderCategories;
  
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-heading font-semibold mb-2 text-center">All Categories</h1>
      <p className="text-gray-600 text-center mb-12">Browse our collection of baby and children's clothing up to 10 years</p>
      
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="group"
          >
            <div className="card overflow-hidden h-full">
              <div className="relative h-64 overflow-hidden">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div 
                    className={`absolute inset-0 ${loading ? 'animate-pulse' : ''}`}
                    style={{
                      backgroundColor: 
                        category.id === 1 ? '#ffcdd2' : // Pink for newborn
                        category.id === 2 ? '#bbdefb' : // Blue for infant
                        category.id === 3 ? '#c8e6c9' : // Green for toddler
                        category.id === 4 ? '#e1bee7' : // Purple for preschooler
                        category.id === 5 ? '#ffe0b2' : // Orange for school age
                        category.id === 6 ? '#fff9c4' : // Yellow for accessories
                        category.id === 7 ? '#ffccbc' : // Peach for special occasions
                        category.id === 8 ? '#b2dfdb' : // Teal for seasonal
                        '#e0e0e0' // Default gray
                    }}
                  >
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                </div>
              </div>
              
              {category.description && (
                <div className="p-4">
                  <p className="text-gray-600">{category.description}</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
