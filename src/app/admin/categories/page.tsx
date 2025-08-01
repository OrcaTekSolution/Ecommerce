'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { FaPlus, FaPenToSquare as FaEdit } from 'react-icons/fa6';

type Category = {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all products in this category.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      // Remove the category from the state
      setCategories(categories.filter(category => category.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again later.');
    }
  };
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-semibold">Categories</h1>
        
        <Link href="/admin/categories/new" className="btn btn-primary flex items-center">
          <FaPlus className="mr-2" />
          Add Category
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h2 className="text-xl font-semibold mb-4">No Categories Found</h2>
          <p className="text-gray-500 mb-8">
            You haven't created any categories yet. Categories help organize your products.
          </p>
          <Link href="/admin/categories/new" className="btn btn-primary">
            Create Your First Category
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 relative">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover rounded"
                          onError={(e) => {
                            // If image fails to load, use colored placeholder
                            const target = e.target as HTMLImageElement;
                            target.style.backgroundColor = 
                              category.id === 1 ? '#ffcdd2' : // Pink for newborn
                              category.id === 2 ? '#bbdefb' : // Blue for infant
                              category.id === 3 ? '#c8e6c9' : // Green for toddler
                              category.id === 4 ? '#fff9c4' : // Yellow for accessories
                              '#e0e0e0'; // Default gray
                            target.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // Transparent GIF
                          }}
                        />
                      ) : (
                        <div 
                          className="absolute inset-0 bg-gray-300 rounded flex items-center justify-center"
                          style={{
                            backgroundColor: 
                              category.id === 1 ? '#ffcdd2' : // Pink for newborn
                              category.id === 2 ? '#bbdefb' : // Blue for infant
                              category.id === 3 ? '#c8e6c9' : // Green for toddler
                              category.id === 4 ? '#fff9c4' : // Yellow for accessories
                              '#e0e0e0' // Default gray
                          }}
                        >
                          <span className="text-xs font-medium text-gray-600">No Image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {category.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link href={`/admin/categories/edit/${category.id}`} className="text-blue-600 hover:text-blue-900">
                        <FaEdit />
                      </Link>
                      <button 
                        onClick={() => handleDelete(category.id)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
