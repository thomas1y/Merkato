import { formatPrice, generateStars } from '../../lib/utils/helpers';

const ProductCard = ({product}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* PRODUCT IMAGE */}
            <div className="relative h-48 bg-gray-200">
                <div className="flex items-center justify-center h-full text--gray-500 ">
                    <div className="text-center">
                        <div className="text-4xl mb-2">🛒</div>
                        <p className="text-sm">Product image</p>
                    </div>
                </div>
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">{product.category}</span>

            </div>

        {/* PRODUCT INFO */}


            <div className="p-4">
                 <h3 className="font-semibold text-lg mb-2 truncate">
                    {product.name}
                 </h3>

                 <div className='flex items-center mb-2'>
                    <span className='text-yellow-500 mr-1'>
                        {generateStars(product.rating)}
                    </span>
                    <span className='text-gray-600 text-sm '>
                        ({product.rating})
                    </span>
                 </div>

                 {/* Price */}
                    <div className='mb-4'>
                        <span className='text-2xl font-bold text-gray-900'>
                            {formatPrice(product.price)}
                        </span>

                    </div>

                    {/* Add to Cart Button */}
                     <button className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200'>
                         Add to Cart
                     </button>

                    {/* Stock Status */}
                    <div className='mt-2 text-sm text-gray-600'>
                            {product.stock > 0 ? (
                            <span className="text-green-600">In Stock ({product.stock} left)</span>
                        ) : (
                            <span className="text-red-600">Out of Stock</span>
                        )}

                    </div>    
            </div>

        

    </div>
  )
}

export default ProductCard