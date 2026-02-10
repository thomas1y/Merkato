// Check if product is in stock
export const isInStock = (product) => {
  return product.inStock && product.stock > 0;
};

// Check available quantity for a product
export const getAvailableStock = (product) => {
  if (!product.inStock) return 0;
  return product.stock;
};

// Validate if requested quantity is available
export const isQuantityAvailable = (product, requestedQuantity) => {
  if (!product.inStock) return false;
  return requestedQuantity <= product.stock;
};