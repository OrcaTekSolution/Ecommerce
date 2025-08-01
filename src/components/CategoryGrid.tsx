'use client';

// @ts-ignore
import { useState, useEffect } from 'react';
// @ts-ignore
import Link from 'next/link';
// @ts-ignore
import Image from 'next/image';
import { staticCategories } from '@/lib/staticData';

type Category = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Placeholder categories while loading or if error
  const placeholderCategories: Category[] = staticCategories;
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        // Only use real data if we have it
        if (data && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          // Otherwise use placeholders
          setCategories(placeholderCategories);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Always use placeholders on error
        setCategories(placeholderCategories);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // If still loading, show placeholders with shimmer effect
  const displayCategories = loading ? placeholderCategories : categories.length > 0 ? categories : placeholderCategories;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {displayCategories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.id}`}
          className="card group"
        >
          <div className="relative h-60 overflow-hidden">
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
        </Link>
      ))}
    </div>
  );
}
