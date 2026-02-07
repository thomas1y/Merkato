export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartTotalItems = (state) => state.cart.items.length;
export const selectIsItemInCart = (id) => (state) => 
  state.cart.items.some(item => item.id === id);