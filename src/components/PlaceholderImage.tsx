'use client';

import React from 'react';

interface PlaceholderImageProps {
  categoryId?: number;
  className?: string;
  width?: string | number;
  height?: string | number;
  name?: string;
}

/**
 * A component that renders a colored placeholder instead of an image.
 * Use this when you don't have an actual image to display.
 */
export default function PlaceholderImage({ 
  categoryId = 0, 
  className = '', 
  width = '100%', 
  height = '100%',
  name
}: PlaceholderImageProps) {
  // Get a color based on the category ID
  const backgroundColor = 
    categoryId === 1 ? '#ffcdd2' : // Pink for newborn
    categoryId === 2 ? '#bbdefb' : // Blue for infant
    categoryId === 3 ? '#c8e6c9' : // Green for toddler
    categoryId === 4 ? '#fff9c4' : // Yellow for accessories
    '#f5f5f5'; // Default light gray

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ 
        backgroundColor, 
        width, 
        height 
      }}
    >
      {name && (
        <span className="text-center text-gray-700 p-2 text-sm font-medium">
          {name}
        </span>
      )}
    </div>
  );
}
