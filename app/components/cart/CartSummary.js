'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectCartSubtotal } from '@/app/lib/store/features/cart/selectors';

export default function CartSummary() {
  const subtotal = useSelector(selectCartSubtotal);
  
  // Calculate shipping (example: free over $50, else $5)
  const shipping = subtotal > 50 ? 0 : 5;
  
  // Calculate tax (example: 8% tax rate)
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  
  // Calculate total
  const total = subtotal + shipping + tax;
  
  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
      
      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Checkout Button */}
      <Link 
        href="/checkout"
        className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-4"
      >
        Proceed to Checkout
      </Link>
      
      {/* Continue Shopping Button */}
      <Link 
        href="/products"
        className="block w-full border border-blue-600 text-blue-600 text-center py-3 rounded-lg hover:bg-blue-50 transition-colors"
      >
        Continue Shopping
      </Link>
      
      {/* Free Shipping Notice */}
      {subtotal < 50 && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          Add ${(50 - subtotal).toFixed(2)} more for <span className="text-green-600">FREE shipping</span>
        </p>
      )}
    </div>
  );
}