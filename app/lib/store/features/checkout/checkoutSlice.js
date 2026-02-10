import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  shippingInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    shippingMethod: 'standard',
  },
  paymentInfo: {
    method: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  },
  billingAddress: {
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  },
  orderNotes: '',
  currentStep: 1,
  errors: {},
  isLoading: false,
  orderId: null,
};

// Async thunk for placing order
export const placeOrder = createAsyncThunk(
  'checkout/placeOrder',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const state = getState();
      const cartItems = state.cart.items;
      
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }
      
      // Generate mock order ID
      const orderId = 'ORD-' + Date.now();
      
      // Return mock success response
      return {
        orderId,
        items: cartItems,
        shippingInfo: state.checkout.shippingInfo,
        total: state.cart.subtotal + 5.99 + (state.cart.subtotal * 0.08),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const loadCheckoutState = () => {
  if (typeof window === 'undefined') {
    return initialState;
  }
  
  try {
    const saved = localStorage.getItem('merkato_checkout');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        errors: {}, // Don't persist errors
        isLoading: false, // Don't persist loading state
        orderId: null, // Don't persist orderId
      };
    }
  } catch (error) {
    console.error('Failed to load checkout state:', error);
  }
  
  return initialState;
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState:loadCheckoutState(),
  reducers: {
    updateShippingInfo: (state, action) => {
      state.shippingInfo = { ...state.shippingInfo, ...action.payload };
      // Clear errors for updated fields
      Object.keys(action.payload).forEach(field => {
        if (state.errors[field]) {
          delete state.errors[field];
        }
      });
    },
    updatePaymentInfo: (state, action) => {
      state.paymentInfo = { ...state.paymentInfo, ...action.payload };
      Object.keys(action.payload).forEach(field => {
        if (state.errors[field]) {
          delete state.errors[field];
        }
      });
    },
    updateBillingAddress: (state, action) => {
      state.billingAddress = { ...state.billingAddress, ...action.payload };
      Object.keys(action.payload).forEach(field => {
        const billingField = `billing${field.charAt(0).toUpperCase() + field.slice(1)}`;
        if (state.errors[billingField]) {
          delete state.errors[billingField];
        }
      });
    },
    setCurrentStep: (state, action) => {
      if (action.payload >= 1 && action.payload <= 3) {
        state.currentStep = action.payload;
      }
    },
    goToNextStep: (state) => {
      if (state.currentStep < 3) {
        state.currentStep += 1;
      }
    },
    goToPrevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setErrors: (state, action) => {
      state.errors = { ...state.errors, ...action.payload };
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    resetCheckout: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
        state.errors = {};
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload.orderId;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = { submit: action.payload || 'Failed to place order' };
      });
  },
});

export const saveCheckoutMiddleware = store => next => action => {
  const result = next(action);
  
  if (action.type?.startsWith('checkout/')) {
    const state = store.getState().checkout;
    // Don't save isLoading or orderId to localStorage
    const stateToSave = {
      ...state,
      isLoading: false,
      orderId: null,
      errors: {},
    };
    
    try {
      localStorage.setItem('merkato_checkout', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save checkout state:', error);
    }
  }
  
  return result;
};

export const {
  updateShippingInfo,
  updatePaymentInfo,
  updateBillingAddress,
  setCurrentStep,
  goToNextStep,
  goToPrevStep,
  setErrors,
  clearErrors,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;