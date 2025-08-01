// @ts-ignore
import Image from 'next/image';
// @ts-ignore
import Link from 'next/link';
// @ts-ignore
import FeaturedProducts from '@/components/FeaturedProducts';
// @ts-ignore
import CategoryGrid from '@/components/CategoryGrid';
// @ts-ignore
import Hero from '@/components/Hero';

export default async function Home() {
  return (
    <div className="flex flex-col gap-12 pb-10">
      {/* Hero Banner */}
      <Hero />
      
      {/* Categories Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-heading font-semibold text-center mb-8">Shop by Category</h2>
        <CategoryGrid />
      </section>
      
      {/* Featured Products */}
      <section className="container mx-auto px-4 py-8 bg-light">
        <h2 className="text-3xl font-heading font-semibold text-center mb-8">Featured Collection</h2>
        <FeaturedProducts />
      </section>
      
      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-heading font-semibold text-center mb-12">Why Choose Tiny Threads?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600">Our products are made with the finest materials, safe for your baby's sensitive skin.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">We offer quick shipping to ensure your items arrive in time for any special occasion.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600">Shop with confidence with our secure payment methods and easy returns.</p>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-semibold mb-4 text-dark">Join Our Newsletter</h2>
            <p className="text-gray-700 mb-6">Subscribe to get special offers and stay updated on new arrivals</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="input flex-grow" 
                required 
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
