'use client';

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/app/lib/store/features/cart/cartSlice';
import Link from "next/link";
import { formatPrice, generateStars } from '../../lib/utils/helpers';
import { useToast } from '@/app/lib/hooks/useToast';
import { selectCartItems } from '@/app/lib/store/features/cart/selectors';
import { FiShoppingCart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const cartItems = useSelector(selectCartItems);

  const handleAddToCart = (e) => {
    // STOP the Link from navigating when button is clicked
    e.preventDefault();
    e.stopPropagation();
    
    // Check if product is in stock
    if (!product.inStock) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    
    const existingItem = cartItems.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    // Check if adding would exceed stock
    if (currentQuantity + 1 > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    
    // Add to cart
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      maxStock: product.stock,
    }));
    
    toast.cart(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
        {/* PRODUCT IMAGE */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {product.image ? (
            <div className="relative w-full h-full">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex items-center justify-center h-full w-full bg-gray-100">
                        <div class="text-center text-gray-400">
                          <div class="text-3xl mb-2">📷</div>
                          <p class="text-sm">${product.name}</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">{product.name}</p>
              </div>
            </div>
          )}
          
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {product.category}
          </span>
          
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <div className='flex items-center mb-2'>
            <span className='text-yellow-500 mr-1'>
              {generateStars(product.rating)}
            </span>
            <span className='text-gray-600 text-sm'>
              ({product.rating})
            </span>
            {product.reviews && (
              <span className="text-gray-400 text-sm ml-2">
                • {product.reviews} reviews
              </span>
            )}
          </div>

          {/* Price */}
          <div className='mb-4'>
            <div className="flex items-center gap-2">
              <span className='text-2xl font-bold text-gray-900'>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className='text-lg text-gray-500 line-through'>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
              !product.inStock || product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={!product.inStock || product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
          >
            <FiShoppingCart className="w-5 h-5" />
            {!product.inStock || product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Stock Status */}
          <div className='mt-2 text-sm'>
            {product.stock > 0 ? (
              <span className="text-green-600">
                {product.stock <= 5 ? (
                  <>
                    <span className="font-semibold">Only {product.stock} left</span> - Order soon!
                  </>
                ) : (
                  `In Stock (${product.stock} available)`
                )}
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;