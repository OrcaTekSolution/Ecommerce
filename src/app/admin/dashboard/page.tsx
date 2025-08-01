'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiUpload, FiTrash2, FiEdit, FiPlus } from 'react-icons/fi'

interface Category {
  id: number
  name: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string | null
  images: string | null
  featured: boolean
  categoryId: number
  category: {
    name: string
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'featured'>('categories')
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState<number | null>(null)
  
  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')
  
  // Product form state
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'ADMIN')) {
      router.push('/admin/login')
      return
    }
    
    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ])
      
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }
      
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (categoryId: number, file: File) => {
    setUploadingImage(categoryId)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('categoryId', categoryId.toString())
    
    try {
      const response = await fetch('/api/categories/upload-image', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const { imageUrl } = await response.json()
        setCategories(prev => 
          prev.map(cat => 
            cat.id === categoryId 
              ? { ...cat, imageUrl }
              : cat
          )
        )
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploadingImage(null)
    }
  }

  const handleDeleteImage = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    
    try {
      const response = await fetch('/api/categories/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId }),
      })
      
      if (response.ok) {
        setCategories(prev => 
          prev.map(cat => 
            cat.id === categoryId 
              ? { ...cat, imageUrl: null }
              : cat
          )
        )
      } else {
        alert('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error deleting image')
    }
  }

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      alert('Please enter a category name')
      return
    }

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      })
      
      if (response.ok) {
        await fetchData()
        setShowCategoryForm(false)
        setEditingCategory(null)
        setCategoryName('')
      } else {
        alert('Failed to save category')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error saving category')
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all associated products.')) return
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchData()
      } else {
        alert('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category')
    }
  }

  const handleSaveProduct = async () => {
    if (!productForm.name.trim() || !productForm.price || !productForm.categoryId) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products'
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          categoryId: parseInt(productForm.categoryId)
        }),
      })
      
      if (response.ok) {
        await fetchData()
        setShowProductForm(false)
        setEditingProduct(null)
        setProductForm({ name: '', description: '', price: '', categoryId: '' })
      } else {
        alert('Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchData()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const handleProductImageUpload = async (productId: number, file: File, imageType: 'main' | 'additional') => {
    setUploadingImage(productId)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('productId', productId.toString())
    formData.append('imageType', imageType)
    
    try {
      const response = await fetch('/api/products/upload-image', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const { product } = await response.json()
        setProducts(prev => 
          prev.map(p => 
            p.id === productId ? product : p
          )
        )
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploadingImage(null)
    }
  }

  const handleDeleteProductImage = async (productId: number, imageUrl: string, imageType: 'main' | 'additional') => {
    if (!confirm('Are you sure you want to delete this image?')) return
    
    try {
      const response = await fetch('/api/products/manage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, imageUrl, imageType }),
      })
      
      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(prev => 
          prev.map(p => 
            p.id === productId ? updatedProduct : p
          )
        )
      } else {
        alert('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error deleting image')
    }
  }

  const handleToggleFeatured = async (productId: number, featured: boolean) => {
    try {
      const response = await fetch('/api/products/manage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, featured }),
      })
      
      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(prev => 
          prev.map(p => 
            p.id === productId ? updatedProduct : p
          )
        )
      } else {
        alert('Failed to update featured status')
      }
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Error updating featured status')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'ADMIN')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {session.user?.name}</span>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('categories')}
              className={`${
                activeTab === 'categories'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`${
                activeTab === 'products'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`${
                activeTab === 'featured'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              Featured Collections ({products.filter(p => p.featured).length})
            </button>
          </nav>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Manage Categories</h2>
              <button
                onClick={() => {
                  setShowCategoryForm(true)
                  setEditingCategory(null)
                  setCategoryName('')
                }}
                className="bg-pink-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-pink-700"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Category Form Modal */}
            {showCategoryForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                  <h3 className="text-lg font-medium mb-4">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <input
                    type="text"
                    placeholder="Category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md mb-4"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveCategory}
                      className="flex-1 bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700"
                    >
                      {editingCategory ? 'Update' : 'Create'}
                    </button>
                    <button
                      onClick={() => {
                        setShowCategoryForm(false)
                        setEditingCategory(null)
                        setCategoryName('')
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        width={400}
                        height={225}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                        <span className="text-pink-600 text-lg font-medium">{category.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{category.name}</h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {/* Upload Image */}
                      <label className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-100">
                        <FiUpload className="w-4 h-4" />
                        <span>{uploadingImage === category.id ? 'Uploading...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage === category.id}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(category.id, file)
                            }
                          }}
                        />
                      </label>
                      
                      {/* Delete Image */}
                      {category.imageUrl && (
                        <button
                          onClick={() => handleDeleteImage(category.id)}
                          className="flex items-center space-x-1 bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Remove Image</span>
                        </button>
                      )}
                      
                      {/* Edit Category */}
                      <button
                        onClick={() => {
                          setEditingCategory(category)
                          setCategoryName(category.name)
                          setShowCategoryForm(true)
                        }}
                        className="flex items-center space-x-1 bg-gray-50 text-gray-600 px-3 py-1 rounded-md text-sm hover:bg-gray-100"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      
                      {/* Delete Category */}
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex items-center space-x-1 bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Manage Products</h2>
              <button
                onClick={() => {
                  setShowProductForm(true)
                  setEditingProduct(null)
                  setProductForm({ name: '', description: '', price: '', categoryId: '' })
                }}
                className="bg-pink-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-pink-700"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-medium mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Product name *"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    
                    <textarea
                      placeholder="Description"
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md h-24"
                    />
                    
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price *"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select category *</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleSaveProduct}
                      className="flex-1 bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700"
                    >
                      {editingProduct ? 'Update' : 'Create'}
                    </button>
                    <button
                      onClick={() => {
                        setShowProductForm(false)
                        setEditingProduct(null)
                        setProductForm({ name: '', description: '', price: '', categoryId: '' })
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Main Product Image */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 text-lg font-medium">{product.name}</span>
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Images */}
                  {product.images && JSON.parse(product.images).length > 0 && (
                    <div className="p-2 bg-gray-50">
                      <div className="flex space-x-2 overflow-x-auto">
                        {JSON.parse(product.images).map((imgUrl: string, index: number) => (
                          <div key={index} className="relative flex-shrink-0">
                            <Image
                              src={imgUrl}
                              alt={`${product.name} ${index + 1}`}
                              width={60}
                              height={60}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <button
                              onClick={() => handleDeleteProductImage(product.id, imgUrl, 'additional')}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <span className="text-lg font-bold text-pink-600">${product.price.toFixed(2)}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {product.category.name}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {/* Upload Main Image */}
                      <label className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-100">
                        <FiUpload className="w-4 h-4" />
                        <span>{uploadingImage === product.id ? 'Uploading...' : 'Main Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage === product.id}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleProductImageUpload(product.id, file, 'main')
                            }
                          }}
                        />
                      </label>
                      
                      {/* Upload Additional Image */}
                      <label className="flex items-center space-x-1 bg-purple-50 text-purple-600 px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-purple-100">
                        <FiUpload className="w-4 h-4" />
                        <span>Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage === product.id}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleProductImageUpload(product.id, file, 'additional')
                            }
                          }}
                        />
                      </label>
                      
                      {/* Delete Main Image */}
                      {product.imageUrl && (
                        <button
                          onClick={() => handleDeleteProductImage(product.id, product.imageUrl, 'main')}
                          className="flex items-center space-x-1 bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Remove Main</span>
                        </button>
                      )}
                      
                      {/* Toggle Featured */}
                      <button
                        onClick={() => handleToggleFeatured(product.id, !product.featured)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm ${
                          product.featured 
                            ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span>⭐</span>
                        <span>{product.featured ? 'Unfeature' : 'Feature'}</span>
                      </button>
                      
                      {/* Edit Product */}
                      <button
                        onClick={() => {
                          setEditingProduct(product)
                          setProductForm({
                            name: product.name,
                            description: product.description,
                            price: product.price.toString(),
                            categoryId: product.categoryId.toString()
                          })
                          setShowProductForm(true)
                        }}
                        className="flex items-center space-x-1 bg-gray-50 text-gray-600 px-3 py-1 rounded-md text-sm hover:bg-gray-100"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      
                      {/* Delete Product */}
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center space-x-1 bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Collections Tab */}
        {activeTab === 'featured' && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Featured Collections</h2>
              <p className="text-sm text-gray-600">
                Products marked as featured will appear in the featured collections section
              </p>
            </div>

            {/* Featured Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(product => product.featured).map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-yellow-200">
                  {/* Main Product Image */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                        <span className="text-yellow-800 text-lg font-medium">{product.name}</span>
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center space-x-1">
                      <span>⭐</span>
                      <span>Featured</span>
                    </div>
                  </div>
                  
                  {/* Additional Images */}
                  {product.images && JSON.parse(product.images).length > 0 && (
                    <div className="p-2 bg-yellow-50">
                      <div className="flex space-x-2 overflow-x-auto">
                        {JSON.parse(product.images).map((imgUrl: string, index: number) => (
                          <Image
                            key={index}
                            src={imgUrl}
                            alt={`${product.name} ${index + 1}`}
                            width={60}
                            height={60}
                            className="w-16 h-16 object-cover rounded-md border-2 border-yellow-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <span className="text-lg font-bold text-pink-600">${product.price.toFixed(2)}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {product.category.name}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {/* Remove from Featured */}
                      <button
                        onClick={() => handleToggleFeatured(product.id, false)}
                        className="flex items-center space-x-1 bg-yellow-50 text-yellow-600 px-3 py-1 rounded-md text-sm hover:bg-yellow-100"
                      >
                        <span>⭐</span>
                        <span>Remove from Featured</span>
                      </button>
                      
                      {/* Edit Product */}
                      <button
                        onClick={() => {
                          setEditingProduct(product)
                          setProductForm({
                            name: product.name,
                            description: product.description,
                            price: product.price.toString(),
                            categoryId: product.categoryId.toString()
                          })
                          setShowProductForm(true)
                        }}
                        className="flex items-center space-x-1 bg-gray-50 text-gray-600 px-3 py-1 rounded-md text-sm hover:bg-gray-100"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {products.filter(product => product.featured).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 text-lg mb-4">⭐</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Featured Products</h3>
                  <p className="text-gray-600 mb-4">
                    Mark products as featured to create special collections that will be highlighted on your website.
                  </p>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
                  >
                    Go to Products
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
