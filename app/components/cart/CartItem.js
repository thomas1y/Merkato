'use client';

import { useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '@/app/lib/store/features/cart/cartSlice';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  
  const handleQuantityChange = (newQuantity) => {
    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
  };
  
  const handleRemove = () => {
    dispatch(removeItem(item.id));
  };
  
  const totalPrice = item.price * item.quantity;
  
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
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
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <p className="text-blue-600 font-semibold">${item.price.toFixed(2)}</p>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
          disabled={item.quantity <= 1}
        >
          <FiMinus className="w-4 h-4" />
        </button>
        
        <span className="w-10 text-center">{item.quantity}</span>
        
        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>
      
      {/* Total Price & Remove */}
      <div className="text-right">
        <p className="font-semibold">${totalPrice.toFixed(2)}</p>
        <button 
          onClick={handleRemove}
          className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
        >
          <FiTrash2 className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  );
}