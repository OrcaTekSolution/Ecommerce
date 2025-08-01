'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaFloppyDisk as FaSave, FaImage } from 'react-icons/fa6';

type Category = {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

export default function AdminCategoryEdit() {
  const params = useParams();
  const router = useRouter();
  const isNewCategory = !params.id || params.id === 'new';
  
  const [category, setCategory] = useState<Category>({
    id: 0,
    name: '',
    description: '',
    imageUrl: null,
  });
  
  const [loading, setLoading] = useState(!isNewCategory);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Image gallery modal
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  
  useEffect(() => {
    if (!isNewCategory) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/categories/${params.id}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch category');
          }
          
          const data = await response.json();
          setCategory(data);
        } catch (err) {
          console.error('Error fetching category:', err);
          setError('Failed to load category. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchCategory();
    }
  }, [isNewCategory, params.id]);
  
  const fetchGalleryImages = async () => {
    try {
      setLoadingGallery(true);
      const response = await fetch('/api/admin/images');
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      setGalleryImages(data);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoadingGallery(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };
  
  const handleSelectImage = (imageUrl: string) => {
    setCategory({ ...category, imageUrl });
    setShowGallery(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.name) {
      setError('Category name is required');
      return;
    }
    
    try {
      setSaving(true);
      
      const url = isNewCategory 
        ? '/api/admin/categories' 
        : `/api/admin/categories/${params.id}`;
      
      const method = isNewCategory ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save category');
      }
      
      setSuccessMessage('Category saved successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/categories');
      }, 1500);
      
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Failed to save category. Please try again later.');
    } finally {
      setSaving(false);
    }
  };
  
  const openGallery = async () => {
    await fetchGalleryImages();
    setShowGallery(true);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading category...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-semibold">
          {isNewCategory ? 'Add New Category' : 'Edit Category'}
        </h1>
        <Link href="/admin/categories" className="btn btn-outline">
          Back to Categories
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={category.name}
              onChange={handleChange}
              className="input w-full"
              placeholder="e.g., Newborn, Infant, Toddler"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={category.description || ''}
              onChange={handleChange}
              rows={4}
              className="input w-full"
              placeholder="Enter a description of this category..."
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Image
            </label>
            
            <div className="flex items-start space-x-4">
              {/* Image Preview */}
              <div className="w-40 h-40 relative border rounded-md overflow-hidden">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image selected</span>
                  </div>
                )}
              </div>
              
              <div>
                <button 
                  type="button"
                  onClick={openGallery}
                  className="btn btn-outline flex items-center mb-2"
                >
                  <FaImage className="mr-2" /> 
                  Select from Gallery
                </button>
                
                {category.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setCategory({ ...category, imageUrl: null })}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove Image
                  </button>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Note: Images must be uploaded to the gallery first from the Image Gallery section.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center"
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Image Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Select an Image</h2>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-130px)]">
              {loadingGallery ? (
                <p className="text-center py-12 text-gray-500">Loading images...</p>
              ) : galleryImages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No images found in gallery.</p>
                  <Link href="/admin/images" className="btn btn-primary">
                    Upload Images
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectImage(image)}
                      className="relative aspect-square border rounded-md overflow-hidden hover:border-primary focus:border-primary"
                    >
                      <Image 
                        src={image} 
                        alt="Gallery image" 
                        fill 
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowGallery(false)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
