'use client';

// @ts-ignore
import Image from 'next/image';
// @ts-ignore
import Link from 'next/link';
// @ts-ignore
import { useState, useEffect } from 'react';
// @ts-ignore
import { FaArrowRight } from 'react-icons/fa';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: null, // Don't try to load non-existent image
      title: 'Adorable Baby Dresses',
      subtitle: 'Premium quality for your little ones',
      cta: 'Shop Collection',
      link: '/products'
    },
    {
      image: null, // Don't try to load non-existent image
      title: 'New Season Collection',
      subtitle: 'Perfect for special occasions',
      cta: 'View Latest',
      link: '/products?featured=true'
    },
    {
      image: null, // Don't try to load non-existent image
      title: 'Baby Accessories',
      subtitle: 'Complete their look',
      cta: 'Explore Now',
      link: '/categories/accessories'
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);
  
  return (
    <section className="relative h-[500px] md:h-[600px] bg-gray-100">
      {/* Image Placeholders for now */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-dark/60 z-10"></div>
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 z-20 text-white">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 animate-fadeIn">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 animate-fadeIn">
              {slides[currentSlide].subtitle}
            </p>
            <Link 
              href={slides[currentSlide].link}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              {slides[currentSlide].cta}
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full mx-1 transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
