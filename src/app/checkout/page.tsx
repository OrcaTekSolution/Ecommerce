'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaCreditCard, FaShoppingCart } from 'react-icons/fa';
import { useCartStore } from '@/lib/store';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const { items, clearCart } = useCartStore();
  
  // Form state
  const [formData, setFormData] = useState({
    shippingName: '',
    shippingEmail: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!session) {
      router.push('/signin?redirect=checkout');
    }
  }, [session, router]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      router.push('/cart');
    }
  }, [items, router, orderSuccess]);
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice || item.price;
    return sum + price * item.quantity;
  }, 0);
  
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      // Order created successfully
      const orderData = await response.json();
      
      // Clear the cart
      clearCart();
      
      // Show success message and redirect
      setOrderSuccess(true);
      setTimeout(() => {
        router.push('/account/orders');
      }, 3000);
      
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message || 'An error occurred while creating your order');
      setLoading(false);
    }
  };
  
  if (!session) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <p>Please sign in to continue checkout...</p>
      </div>
    );
  }
  
  if (orderSuccess) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-100 text-green-700 p-6 rounded-lg mb-8">
            <div className="text-5xl mb-4">
              <FaShoppingCart className="mx-auto" />
            </div>
            <h1 className="text-3xl font-heading font-semibold mb-4">Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order has been received and is being processed.</p>
            <p className="mt-2">You will be redirected to your orders page shortly.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-heading font-semibold mb-8">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="shippingName" className="block mb-1 text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="shippingName"
                    name="shippingName"
                    value={formData.shippingName}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="shippingEmail" className="block mb-1 text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="shippingEmail"
                    name="shippingEmail"
                    value={formData.shippingEmail}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="shippingPhone" className="block mb-1 text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="shippingPhone"
                  name="shippingPhone"
                  value={formData.shippingPhone}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="shippingAddress" className="block mb-1 text-sm font-medium">
                  Address
                </label>
                <input
                  type="text"
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div>
                  <label htmlFor="shippingCity" className="block mb-1 text-sm font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    id="shippingCity"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="shippingState" className="block mb-1 text-sm font-medium">
                    State
                  </label>
                  <input
                    type="text"
                    id="shippingState"
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="shippingZip" className="block mb-1 text-sm font-medium">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    id="shippingZip"
                    name="shippingZip"
                    value={formData.shippingZip}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
              </div>
              
              {/* Payment section would be added here in a real application */}
              <div className="bg-gray-50 p-4 rounded-md mb-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Payment Method</h3>
                  <div className="flex items-center">
                    <FaCreditCard className="text-gray-400 mr-2" />
                    <span>Credit Card (Demo)</span>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="divide-y">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="py-3 flex justify-between">
                  <div>
                    <div className="font-medium">
                      {item.name} {item.quantity > 1 && <span>x{item.quantity}</span>}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' | '}
                      {item.color && `Color: ${item.color}`}
                    </div>
                  </div>
                  <div className="font-medium">
                    ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-green-500">Free</span>
                ) : (
                  <span>${shippingCost.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
