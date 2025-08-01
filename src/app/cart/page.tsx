'use client';

// @ts-ignore
import { useEffect, useState } from 'react';
// @ts-ignore
import Image from 'next/image';
// @ts-ignore
import Link from 'next/link';
// @ts-ignore
import { useCartStore } from '@/lib/store';
// @ts-ignore
import { FaTrash, FaArrowLeft, FaCreditCard } from 'react-icons/fa';

type CartItemWithProduct = {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  // Fix for hydration issues with localStorage
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="container mx-auto py-16 px-4">Loading cart...</div>;
  }
  
  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice || item.price;
    return sum + price * item.quantity;
  }, 0);
  
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-heading font-semibold mb-8">Your Cart</h1>
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-heading font-semibold mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">Item</h2>
                <h2 className="text-xl font-semibold">Total</h2>
              </div>
              
              {/* Cart Items */}
              <div className="divide-y">
                {items.map((item) => {
                  const price = item.salePrice || item.price;
                  const itemTotal = price * item.quantity;
                  
                  return (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="py-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 relative flex-shrink-0">
                        <div
                          className="absolute inset-0 rounded flex items-center justify-center"
                          style={{
                            backgroundColor: 
                              String(item.id).startsWith('1') ? '#ffcdd2' : // Pink for newborn
                              String(item.id).startsWith('2') ? '#bbdefb' : // Blue for infant
                              String(item.id).startsWith('3') ? '#c8e6c9' : // Green for toddler
                              String(item.id).startsWith('4') ? '#fff9c4' : // Yellow for accessories
                              '#f5f5f5' // Default light gray
                          }}
                        >
                          <span className="text-xs font-medium text-center">{item.name.substring(0, 10)}</span>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-grow text-center sm:text-left">
                        <Link href={`/products/${item.id}`} className="font-medium hover:text-primary">
                          {item.name}
                        </Link>
                        
                        {(item.size || item.color) && (
                          <div className="text-sm text-gray-500 mt-1">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.size && item.color && <span> | </span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
                          <span className="text-gray-600">
                            ${price.toFixed(2)}
                          </span>
                          {item.salePrice && (
                            <span className="text-gray-400 text-sm line-through">
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-center sm:justify-start mt-2 gap-1">
                          <label htmlFor={`quantity-${item.id}`} className="sr-only">
                            Quantity
                          </label>
                          <select
                            id={`quantity-${item.id}`}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), item.size, item.color)}
                            className="border rounded px-2 py-1"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                              <option key={qty} value={qty}>
                                {qty}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Price and Remove */}
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="font-medium">${itemTotal.toFixed(2)}</div>
                        <button
                          onClick={() => removeItem(item.id, item.size, item.color)}
                          className="text-gray-500 hover:text-red-500"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Cart Actions */}
              <div className="mt-6 flex flex-wrap gap-4 justify-between">
                <Link href="/products" className="flex items-center text-primary hover:underline">
                  <FaArrowLeft className="mr-1" /> Continue Shopping
                </Link>
                <button 
                  onClick={() => clearCart()}
                  className="btn btn-outline"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4">
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
              {shippingCost > 0 && (
                <div className="text-sm text-gray-500">
                  Add ${(50 - subtotal).toFixed(2)} more to get free shipping
                </div>
              )}
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <FaCreditCard /> Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
