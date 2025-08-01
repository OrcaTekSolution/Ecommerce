'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { FaUpload, FaCopy } from 'react-icons/fa6';

export default function AdminImageGallery() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Check if user is admin
  useEffect(() => {
    if (status === 'authenticated') {
      // @ts-ignore - we know role exists because we added it to the session
      if (session?.user?.role !== 'admin') {
        router.push('/'); // Redirect non-admins
      } else {
        fetchImages();
      }
    } else if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/admin/images');
    }
  }, [session, status, router]);
  
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/images');
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      setImages(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    try {
      setUploadingFile(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      setImages([...images, data.url]);
      setSuccessMessage('Image uploaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };
  
  const handleDelete = async (url: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const response = await fetch('/api/admin/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      
      // Remove image from state
      setImages(images.filter(image => image !== url));
      setSuccessMessage('Image deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage('URL copied to clipboard!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  if (status === 'loading') {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-heading font-semibold mb-8">Image Gallery</h1>
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-heading font-semibold mb-8">Image Gallery</h1>
      
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
      
      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
        
        <div className="flex items-center">
          <label className="btn btn-primary mr-4">
            <FaUpload className="mr-2" />
            {uploadingFile ? 'Uploading...' : 'Select File'}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={uploadingFile} 
            />
          </label>
          <span className="text-sm text-gray-500">
            Supported formats: JPG, PNG, WebP, GIF
          </span>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">All Images</h2>
        
        {loading ? (
          <p>Loading images...</p>
        ) : images.length === 0 ? (
          <p>No images found. Upload some images to get started.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((url, index) => (
              <div key={index} className="group relative border rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <Image 
                    src={url} 
                    alt={`Gallery image ${index + 1}`} 
                    fill 
                    className="object-cover"
                  />
                </div>
                
                {/* Hover Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => copyToClipboard(url)} 
                    className="p-2 bg-white rounded-full"
                    title="Copy URL"
                  >
                    <FaCopy />
                  </button>
                  <button 
                    onClick={() => handleDelete(url)} 
                    className="p-2 bg-white text-red-500 rounded-full"
                    title="Delete Image"
                  >
                    <FaTrash />
                  </button>
                </div>
                
                {/* URL Display */}
                <div className="p-2 bg-gray-100 text-xs truncate">
                  {url.split('/').pop()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
