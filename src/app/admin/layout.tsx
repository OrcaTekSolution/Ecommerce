'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { FaImages, FaBoxOpen, FaTags, FaUsers, FaChartLine } from 'react-icons/fa6';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'authenticated') {
      // @ts-ignore - we know role exists because we added it to the session
      if (session?.user?.role !== 'admin') {
        router.push('/'); // Redirect non-admins
      } else {
        setLoading(false);
      }
    } else if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/admin');
    }
  }, [session, status, router]);
  
  if (loading && status !== 'loading') {
    return (
      <div className="container mx-auto py-16 px-4">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="bg-gray-800 text-white w-full md:w-64 md:min-h-screen p-4">
        <div className="text-2xl font-bold mb-8 mt-4">Admin Panel</div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/dashboard" className="flex items-center p-3 rounded hover:bg-gray-700">
                <FaChartLine className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="flex items-center p-3 rounded hover:bg-gray-700">
                <FaBoxOpen className="mr-3" />
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/categories" className="flex items-center p-3 rounded hover:bg-gray-700">
                <FaTags className="mr-3" />
                Categories
              </Link>
            </li>
            <li>
              <Link href="/admin/images" className="flex items-center p-3 rounded hover:bg-gray-700 bg-gray-700">
                <FaImages className="mr-3" />
                Image Gallery
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="flex items-center p-3 rounded hover:bg-gray-700">
                <FaUsers className="mr-3" />
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}
