import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import uiReducer from './features/ui/uiSlice'; 

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      ui: uiReducer,
    },
  });
};