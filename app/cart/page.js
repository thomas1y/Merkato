'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Link from 'next/link';
import EmptyCart from '@/app/components/cart/EmptyCart';
import CartItem from '@/app/components/cart/CartItem';
import CartSummary from '@/app/components/cart/CartSummary';
import { selectCartItems } from '@/app/lib/store/features/cart/selectors';
import { clearCart } from '@/app/lib/store/features/cart/cartSlice';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const handleClearCart = () => {
    dispatch(clearCart());
    setShowClearConfirm(false);
    
  };
  
  // If cart is empty
  if (cartItems.length === 0) {
    return <EmptyCart />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-3">Clear Cart?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your cart? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Page Header */}
      <div className="mb-8">
        <Link 
          href="/products" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Continue Shopping
        </Link>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-gray-600">
              You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <FiTrash2 className="w-5 h-5" />
            Clear Cart
          </button>
        </div>
      </div>
      
      {/* Rest of the cart page remains the same */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border overflow-hidden">
            {/* Cart Items Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-semibold text-gray-700">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>
            
            {/* Cart Items List */}
            <div className="divide-y">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            {/* Cart Actions */}
            <div className="p-4 border-t flex justify-between">
              <Link 
                href="/products"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Continue Shopping
              </Link>
              
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Promo Code Section */}
          <div className="mt-6 bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Have a promo code?</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 border rounded-lg px-4 py-2"
              />
              <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900">
                Apply
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
          
          {/* Security & Trust Badges */}
          <div className="mt-6 p-6 border rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-3">Secure Shopping</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Secure SSL encryption
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                30-day return policy
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Free shipping over $50
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}