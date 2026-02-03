
import ProductFilters from "@/app/components/products/ProductFilters";
import ProductSort from "@/app/components/products/ProductSort";
import ProductCard from "@/app/components/products/ProductCard";
import { products } from "@/app/lib/utils/mockData";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner - Updated in previous task */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-700 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Our Products
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Discover high-quality products for every need. Filter, sort, and find exactly what you're looking for.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filters */}
          <div className="lg:w-1/4">
            <ProductFilters />
          </div>
          
          {/* Right: Products grid */}
          <div className="lg:w-3/4">
            {/* Sort and product count header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <ProductSort />
              <div className="mt-2 sm:mt-0 text-gray-600">
                <span className="font-medium">{products.length}</span> products found
              </div>
            </div>
            
            {/* Products Grid - NOW WITH REAL PRODUCTS */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      1
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                      2
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                      3
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}