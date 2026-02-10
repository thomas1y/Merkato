'use client';

import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartSubtotal } from '@/app/lib/store/features/cart/selectors';
import { selectCurrentStep, selectIsShippingValid, selectIsPaymentValid } from '@/app/lib/store/features/checkout/selectors';
import { goToNextStep } from '@/app/lib/store/features/checkout/checkoutSlice';
import EmptyCart from '@/app/components/cart/EmptyCart';
import CartItem from '@/app/components/cart/CartItem';
import { useToast } from '@/app/lib/hooks/useToast';

export default function CheckoutSidebar() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const currentStep = useSelector(selectCurrentStep);
  const isShippingValid = useSelector(selectIsShippingValid);
  const isPaymentValid = useSelector(selectIsPaymentValid);
  
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleNextStep = () => {
    if (currentStep === 1 && !isShippingValid) {
      toast.error('Please complete shipping information first');
      return;
    }
    if (currentStep === 2 && !isPaymentValid) {
      toast.error('Please complete payment information first');
      return;
    }
    dispatch(goToNextStep());
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
        <EmptyCart message="Your cart is empty" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Cart Items List */}
      <div className="mb-6 max-h-96 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div key={item.id} className="mb-4 pb-4 border-b last:border-0">
            <CartItem item={item} isCheckout={true} />
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
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

      {/* Step-specific button */}
      <button
        onClick={handleNextStep}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={
          (currentStep === 1 && !isShippingValid) ||
          (currentStep === 2 && !isPaymentValid)
        }
      >
        {currentStep === 1 && 'Continue to Payment'}
        {currentStep === 2 && 'Review Order'}
        {currentStep === 3 && 'Place Order'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        {currentStep === 1 && 'Complete shipping information to continue'}
        {currentStep === 2 && 'Complete payment information to continue'}
        {currentStep === 3 && 'Review your order before placing'}
      </p>
    </div>
  );
}