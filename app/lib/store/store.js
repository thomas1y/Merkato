import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
// We'll add more slices later (auth, products, etc.)

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
     
    },
  });
};