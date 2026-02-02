import ProductFilters from '../components/products/ProductFilters';
import ProductSort from '../components/products/ProductSort';
import ProductCard from '../components/products/ProductCard';

const ProductsPage = () => {
  return (
    <div>

         {/* BANNER SECTION */}
            <div className="bg-gray-400 text-white py-12">
                <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-4">All Products</h1>
                <p className="text-gray-300">
                    Browse our complete collection of products
                </p>
                </div>
            </div>

         {/* MAIN CONTENT - TWO COLUMNS */}
           <div className='container mx-auto px-4 py-8'>
                <div className='flex flex-col lg:flex-row gap-8'>
                     {/* LEFT COLUMN - FILTERS */}
                    <div className="lg:w-1/4">
                        <ProductFilters />
                    </div>
                     
                       {/* RIGHT COLUMN - PRODUCTS */}
                    <div className="lg:w-3/4">
                          {/* SORT BAR */}
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <p className="text-gray-600">
                                    Showing products
                                    </p>
                                    </div>
                                    <ProductSort />
                                    </div>
                                    {/* PRODUCTS GRID */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {/* Product Cards will go here */}
                                        <div className="text-center py-12">
                                            <p className="text-gray-500">Product cards will appear here</p>
                                        </div>
                                        </div>

                                        {/* PAGINATION */}
            <div className="mt-12 flex justify-center">
              <nav className="flex space-x-2">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  ← Previous
                </button>
                <button className="px-4 py-2 border rounded-lg bg-blue-500 text-white">
                  1
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Next →
                </button>
              </nav>
            </div>

                            </div>
                   </div>
           </div>
    </div>
  )
}

export default ProductsPage