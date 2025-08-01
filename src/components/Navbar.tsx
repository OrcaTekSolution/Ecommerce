'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useCartStore } from '@/lib/store';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items: cartItems } = useCartStore();
  
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="font-heading text-2xl font-bold text-primary">
            Tiny Threads
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`font-medium hover:text-primary transition-colors ${pathname === '/' ? 'text-primary' : 'text-gray-700'}`}
            >
              Home
            </Link>
            <Link 
              href="/categories" 
              className={`font-medium hover:text-primary transition-colors ${pathname === '/categories' ? 'text-primary' : 'text-gray-700'}`}
            >
              Categories
            </Link>
            <Link 
              href="/products" 
              className={`font-medium hover:text-primary transition-colors ${pathname === '/products' ? 'text-primary' : 'text-gray-700'}`}
            >
              All Products
            </Link>
            <Link 
              href="/about" 
              className={`font-medium hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary' : 'text-gray-700'}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium hover:text-primary transition-colors ${pathname === '/contact' ? 'text-primary' : 'text-gray-700'}`}
            >
              Contact
            </Link>
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                <Link href="/account" className="flex items-center gap-2 hover:text-primary">
                  <FaUser className="text-gray-600" /> 
                  <span>{session.user?.name?.split(' ')[0] || 'Account'}</span>
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className="text-gray-600 hover:text-primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/signin" 
                className="text-gray-600 hover:text-primary"
              >
                Sign In / Register
              </Link>
            )}
            <Link 
              href="/cart" 
              className="flex items-center gap-2 text-gray-700 hover:text-primary relative"
            >
              <FaShoppingCart />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span>Cart</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link 
              href="/cart" 
              className="text-gray-700 hover:text-primary relative"
            >
              <FaShoppingCart className="text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button 
              onClick={toggleMobileMenu} 
              className="text-gray-500 hover:text-primary"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3 space-y-3 bg-white border-t">
          <Link 
            href="/" 
            className={`block font-medium hover:text-primary ${pathname === '/' ? 'text-primary' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/categories" 
            className={`block font-medium hover:text-primary ${pathname === '/categories' ? 'text-primary' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </Link>
          <Link 
            href="/products" 
            className={`block font-medium hover:text-primary ${pathname === '/products' ? 'text-primary' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            All Products
          </Link>
          <Link 
            href="/about" 
            className={`block font-medium hover:text-primary ${pathname === '/about' ? 'text-primary' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`block font-medium hover:text-primary ${pathname === '/contact' ? 'text-primary' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          {/* User Actions */}
          <div className="pt-2 border-t">
            {session ? (
              <>
                <Link 
                  href="/account" 
                  className="block text-gray-700 hover:text-primary py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }} 
                  className="block text-gray-700 hover:text-primary py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/signin" 
                className="block text-gray-700 hover:text-primary py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
