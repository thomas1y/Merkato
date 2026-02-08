'use client';

import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';

export default function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        {/* Empty Cart Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <FiShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        
        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/products"
            className="inline-block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Browse Products
          </Link>
          
          <Link 
            href="/"
            className="inline-block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </Link>
        </div>
        
        {/* Quick Categories */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/products?category=electronics"
              className="bg-gray-50 p-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Electronics
            </Link>
            <Link 
              href="/products?category=clothing"
              className="bg-gray-50 p-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Clothing
            </Link>
            <Link 
              href="/products?category=home"
              className="bg-gray-50 p-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Home & Garden
            </Link>
            <Link 
              href="/products?category=sports"
              className="bg-gray-50 p-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Sports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}