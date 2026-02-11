import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import uiReducer from './features/ui/uiSlice';
import checkoutReducer from './features/checkout/checkoutSlice';
import authReducer from './features/auth/authSlice'; 
import { saveCheckoutMiddleware } from './features/checkout/checkoutSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      ui: uiReducer,
      checkout: checkoutReducer,
      auth: authReducer, 
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        },
      }).concat(saveCheckoutMiddleware),
  });
};