
import { featuredProducts } from '../../lib/utils/mockData';
import ProductCard from '../products/ProductCard';

const FeaturedProducts = () => {
  return (
    <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
             <div className='flex justify-between items-center mb-8'>
                 <h2 className='text-3xl font-bold'>
                      Featured Products
                 </h2>
                 <button className='text-blue-600 hover:text-blue-800 font-semibold'>
                      View All →
                 </button>
             </div>
             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                 {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
             </div>
        </div>
    </section>
  )
}

export default FeaturedProducts