'use client';

import { useDispatch, useSelector } from 'react-redux';
import { placeOrder, goToPrevStep, resetCheckout } from '@/app/lib/store/features/checkout/checkoutSlice';
import { clearCart } from '@/app/lib/store/features/cart/cartSlice';
import { selectShippingInfo, selectPaymentInfo, selectBillingAddress, selectIsLoading, selectOrderId } from '@/app/lib/store/features/checkout/selectors';
import { selectCartItems, selectCartSubtotal } from '@/app/lib/store/features/cart/selectors';
import { useToast } from '@/app/lib/hooks/useToast';
import { useState, useEffect } from 'react';

export default function ReviewOrder() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const shippingInfo = useSelector(selectShippingInfo);
  const paymentInfo = useSelector(selectPaymentInfo);
  const billingAddress = useSelector(selectBillingAddress);
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const isLoading = useSelector(selectIsLoading);
  const orderId = useSelector(selectOrderId);
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const shippingCost = shippingInfo.shippingMethod === 'express' ? 12.99 : 
                      shippingInfo.shippingMethod === 'overnight' ? 24.99 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async () => {
    const result = await dispatch(placeOrder());
    
    if (placeOrder.fulfilled.match(result)) {
      setOrderPlaced(true);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
    } else {
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleBack = () => {
    dispatch(goToPrevStep());
  };

  const handleContinueShopping = () => {
    dispatch(resetCheckout());
    window.location.href = '/';
  };

  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '•••• •••• •••• ••••';
    const lastFour = cardNumber.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  if (orderPlaced) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-green-600">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
        <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
        <p className="text-gray-600 mb-6">Your order ID is: <span className="font-semibold">{orderId}</span></p>
        <div className="space-y-4">
          <button
            onClick={handleContinueShopping}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to {shippingInfo.email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{shippingInfo.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{shippingInfo.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Shipping Method</p>
            <p className="font-medium">
              {shippingInfo.shippingMethod === 'express' ? 'Express Shipping' :
               shippingInfo.shippingMethod === 'overnight' ? 'Overnight Shipping' : 'Standard Shipping'}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">
              {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium">
              {paymentInfo.method === 'credit_card' ? 'Credit Card' :
               paymentInfo.method === 'paypal' ? 'PayPal' :
               paymentInfo.method === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
            </p>
          </div>
          {paymentInfo.method === 'credit_card' && (
            <>
              <div>
                <p className="text-sm text-gray-600">Card Number</p>
                <p className="font-medium">{formatCardNumber(paymentInfo.cardNumber)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cardholder Name</p>
                <p className="font-medium">{paymentInfo.cardName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expires</p>
                <p className="font-medium">{paymentInfo.expiryDate}</p>
              </div>
            </>
          )}
        </div>
        
        {/* Billing Address */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-medium text-gray-900 mb-4">Billing Address</h3>
          {billingAddress.sameAsShipping ? (
            <p className="text-gray-600">Same as shipping address</p>
          ) : (
            <p className="font-medium">
              {billingAddress.firstName} {billingAddress.lastName}<br />
              {billingAddress.address}<br />
              {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
        >
          ← Back to Payment
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={isLoading || cartItems.length === 0}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Place Order — $${total.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
}