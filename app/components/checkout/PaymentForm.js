'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePaymentInfo, updateBillingAddress, goToNextStep, goToPrevStep, setErrors } from '@/app/lib/store/features/checkout/checkoutSlice';
import { selectPaymentInfo, selectBillingAddress, selectShippingInfo, selectCheckoutErrors } from '@/app/lib/store/features/checkout/selectors';
import { validatePaymentForm } from '@/app/lib/utils/validation';
import { useToast } from '@/app/lib/hooks/useToast';

export default function PaymentForm() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const paymentInfo = useSelector(selectPaymentInfo);
  const billingAddress = useSelector(selectBillingAddress);
  const shippingInfo = useSelector(selectShippingInfo);
  const errors = useSelector(selectCheckoutErrors);
  
  const [cardNumber, setCardNumber] = useState(paymentInfo.cardNumber || '');

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces
      const formatted = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      setCardNumber(formatted);
      dispatch(updatePaymentInfo({ cardNumber: formatted.replace(/\s/g, '') }));
    } else if (type === 'checkbox') {
      dispatch(updatePaymentInfo({ [name]: checked }));
    } else {
      dispatch(updatePaymentInfo({ [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      dispatch(setErrors({ ...errors, [name]: '' }));
    }
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateBillingAddress({ [name]: value }));
  };

  const handleSameAsShipping = (checked) => {
    dispatch(updateBillingAddress({ 
      sameAsShipping: checked,
      ...(checked ? {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
      } : {})
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validatePaymentForm(paymentInfo, billingAddress);
    
    if (Object.keys(validationErrors).length === 0) {
      dispatch(goToNextStep());
      toast.success('Payment information saved!');
    } else {
      dispatch(setErrors(validationErrors));
      toast.error('Please fix the errors in the payment form');
    }
  };

  const handleBack = () => {
    dispatch(goToPrevStep());
  };

  const paymentMethods = [
    { id: 'credit_card', label: 'Credit Card', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
    { id: 'apple_pay', label: 'Apple Pay', icon: '' },
    { id: 'google_pay', label: 'Google Pay', icon: 'G' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`
                flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer
                ${paymentInfo.method === method.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                name="method"
                value={method.id}
                checked={paymentInfo.method === method.id}
                onChange={handlePaymentChange}
                className="sr-only"
              />
              <span className="text-2xl mb-2">{method.icon}</span>
              <span className="text-sm font-medium">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Credit Card Form (shown only for credit card) */}
      {paymentInfo.method === 'credit_card' && (
        <div className="space-y-6 p-6 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handlePaymentChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="cardName"
                value={paymentInfo.cardName}
                onChange={handlePaymentChange}
                placeholder="John Doe"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date (MM/YY) *
              </label>
              <input
                type="text"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handlePaymentChange}
                placeholder="12/25"
                maxLength={5}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV *
              </label>
              <input
                type="text"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                placeholder="123"
                maxLength={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cvv ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cvv && (
                <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
              )}
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="saveCard"
                  checked={paymentInfo.saveCard}
                  onChange={handlePaymentChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Save card for future purchases</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Other Payment Methods Placeholder */}
      {paymentInfo.method !== 'credit_card' && (
        <div className="p-6 border rounded-lg bg-gray-50 text-center">
          <p className="text-gray-600">
            {paymentInfo.method === 'paypal' && 'You will be redirected to PayPal to complete your payment.'}
            {paymentInfo.method === 'apple_pay' && 'Apple Pay integration coming soon.'}
            {paymentInfo.method === 'google_pay' && 'Google Pay integration coming soon.'}
          </p>
        </div>
      )}

      {/* Billing Address */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={billingAddress.sameAsShipping}
              onChange={(e) => handleSameAsShipping(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Same as shipping address</span>
          </label>
        </div>

        {!billingAddress.sameAsShipping && (
          <div className="space-y-4 p-6 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={billingAddress.firstName}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.billingFirstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.billingFirstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingFirstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={billingAddress.lastName}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.billingLastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.billingLastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingLastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={billingAddress.address}
                onChange={handleBillingChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.billingAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.billingAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.billingAddress}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={billingAddress.city}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.billingCity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.billingCity && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingCity}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={billingAddress.state}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.billingState ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.billingState && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingState}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={billingAddress.zipCode}
                  onChange={handleBillingChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.billingZipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.billingZipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingZipCode}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Notes (Optional)
        </label>
        <textarea
          name="orderNotes"
          value={paymentInfo.orderNotes}
          onChange={handlePaymentChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Special instructions for your order..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
        >
          ← Back to Shipping
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Review Order →
        </button>
      </div>
    </form>
  );
}