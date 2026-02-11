'use client';

import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity } from '@/app/lib/store/features/cart/cartSlice';
import { useToast } from '@/app/lib/hooks/useToast';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { products } from '@/app/lib/utils/mockData'; 

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const toast = useToast();
  
  
  const product = products.find(p => p.id === item.id);
  const maxStock = product?.stock || 10; 
  
  const handleQuantityChange = (newQuantity) => {
    // Validation 1: Quantity must be at least 1
    if (newQuantity < 1) {
      toast.error('Quantity cannot be less than 1');
      return;
    }
    
    // Validation 2: Check if product exists and is in stock
    if (!product) {
      toast.error('Product information not found');
      return;
    }
    
    // Validation 3: Check stock availability
    if (newQuantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }
    
    // Validation 4: Check if product is in stock
    if (!product.inStock) {
      toast.error('This product is out of stock');
      return;
    }
    
    // If all validations pass, update quantity
    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    
    // Show appropriate toast message
    if (newQuantity > item.quantity) {
      toast.info(`Increased ${item.name} quantity to ${newQuantity}`);
    } else if (newQuantity < item.quantity) {
      toast.info(`Decreased ${item.name} quantity to ${newQuantity}`);
    }
  };
  
  const handleIncrement = () => {
    const newQuantity = item.quantity + 1;
    handleQuantityChange(newQuantity);
  };
  
  const handleDecrement = () => {
    const newQuantity = item.quantity - 1;
    handleQuantityChange(newQuantity);
  };
  
  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    toast.warning(`${item.name} removed from cart`);
  };
  
  const totalPrice = item.price * item.quantity;
  
  return (
    <div className="flex items-center gap-4 p-4 border-b hover:bg-gray-50 transition-colors">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
        <p className="text-blue-600 font-semibold">${item.price.toFixed(2)}</p>
        
        {/* Stock Status */}
        {product && (
          <div className="text-sm mt-1">
            {product.inStock ? (
              <span className="text-green-600">
                {product.stock} in stock
              </span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </div>
        )}
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleDecrement}
          className={`w-8 h-8 flex items-center justify-center border rounded transition-colors ${
            item.quantity <= 1 
              ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
              : 'border-gray-300 hover:bg-gray-100 hover:border-gray-400'
          }`}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <FiMinus className="w-4 h-4" />
        </button>
        
        <span className="w-10 text-center font-medium">{item.quantity}</span>
        
        <button 
          onClick={handleIncrement}
          className={`w-8 h-8 flex items-center justify-center border rounded transition-colors ${
            item.quantity >= maxStock
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 hover:bg-gray-100 hover:border-gray-400'
          }`}
          disabled={item.quantity >= maxStock}
          aria-label="Increase quantity"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>
      
      {/* Total Price & Remove */}
      <div className="text-right min-w-24">
        <p className="font-semibold text-gray-800">${totalPrice.toFixed(2)}</p>
        <button 
          onClick={handleRemove}
          className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1 text-sm transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          <FiTrash2 className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  );
}