import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const newToast = {
        id: Date.now(),
        ...action.payload,
      };
      state.toasts.push(newToast);
      
      // Keep only last 3 toasts
      if (state.toasts.length > 3) {
        state.toasts.shift();
      }
    },
    
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = uiSlice.actions;
export default uiSlice.reducer;