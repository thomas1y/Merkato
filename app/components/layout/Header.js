'use client';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectCartTotalQuantity } from '@/app/lib/store/features/cart/selectors';
import { FiShoppingCart, FiSearch, FiUser } from 'react-icons/fi';

const Header = () => {
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky bg-white border-b top-0 w-full z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          
          {/* LOGO SECTION - Left side */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              merkato
            </Link>
          </div>

          {/* SEARCH BAR - Center */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-3 top-3">
                🔍
              </button>
            </div>
          </div>

          {/* NAVIGATION & USER - Right side */}
          <div className="flex items-center space-x-8">
            
            {/* NAVIGATION LINKS */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Products
              </Link>
              <Link 
                href="/cart" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Cart
              </Link>
              <Link 
                href="/checkout" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Checkout
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
            </nav>

            {/* CART ICON with badge */}
            <Link 
              href="/cart" 
              className="relative text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FiShoppingCart className="w-6 h-6" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>
           
            {/* USER MENU / LOGIN */}
            <div>
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition">
                <span>👤</span>
                <span className="hidden md:inline">Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;