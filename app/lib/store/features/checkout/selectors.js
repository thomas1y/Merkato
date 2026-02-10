export const selectShippingInfo = (state) => state.checkout.shippingInfo;
export const selectPaymentInfo = (state) => state.checkout.paymentInfo;
export const selectBillingAddress = (state) => state.checkout.billingAddress;
export const selectCurrentStep = (state) => state.checkout.currentStep;
export const selectCheckoutErrors = (state) => state.checkout.errors;
export const selectOrderNotes = (state) => state.checkout.orderNotes;
export const selectIsLoading = (state) => state.checkout.isLoading;
export const selectOrderId = (state) => state.checkout.orderId;

// Validation selectors
export const selectIsShippingValid = (state) => {
  const shipping = state.checkout.shippingInfo;
  return (
    shipping.firstName?.trim() &&
    shipping.lastName?.trim() &&
    shipping.email?.trim() &&
    shipping.phone?.trim() &&
    shipping.address?.trim() &&
    shipping.city?.trim() &&
    shipping.state?.trim() &&
    shipping.zipCode?.trim()
  );
};

export const selectIsPaymentValid = (state) => {
  const payment = state.checkout.paymentInfo;
  
  if (payment.method === 'credit_card') {
    return (
      payment.cardNumber?.replace(/\s/g, '').length === 16 &&
      payment.cardName?.trim() &&
      payment.expiryDate?.match(/^\d{2}\/\d{2}$/) &&
      payment.cvv?.length === 3
    );
  }
  
  return payment.method !== '';
};