import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import uiReducer from './features/ui/uiSlice';
import checkoutReducer from './features/checkout/checkoutSlice';
import { saveCheckoutMiddleware } from './features/checkout/checkoutSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      ui: uiReducer,
      checkout: checkoutReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(saveCheckoutMiddleware),
  });
};