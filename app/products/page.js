

"use client"; 

import { useState, useEffect } from "react";
import ProductFilters from "@/app/components/products/ProductFilters";
import ProductSort from "@/app/components/products/ProductSort";
import ProductCard from "@/app/components/products/ProductCard";
import { products as allProducts } from "@/app/lib/utils/mockData";

export default function ProductsPage() {
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [sortOption, setSortOption] = useState("featured");

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...allProducts];

    // 1. Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category.toLowerCase())
      );
    }

    // 2. Apply price range filter
    if (priceRange) {
      switch (priceRange) {
        case "under50":
          result = result.filter(product => product.price < 50);
          break;
        case "50to100":
          result = result.filter(product => product.price >= 50 && product.price <= 100);
          break;
        case "100to200":
          result = result.filter(product => product.price > 100 && product.price <= 200);
          break;
        case "over200":
          result = result.filter(product => product.price > 200);
          break;
      }
    }

    // 3. Apply rating filter
    if (minRating > 0) {
      result = result.filter(product => product.rating >= minRating);
    }

    // 4. Apply sorting
    switch (sortOption) {
      case "priceLowHigh":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        
        break;
    }

    setFilteredProducts(result);
  }, [selectedCategories, priceRange, minRating, sortOption]);

  // Handler functions
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      const cat = category.toLowerCase();
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const handlePriceChange = (range) => {
    setPriceRange(range === priceRange ? "" : range);
  };

  const handleRatingChange = (rating) => {
    setMinRating(rating === minRating ? 0 : rating);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange("");
    setMinRating(0);
    setSortOption("featured");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
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
            <ProductFilters 
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              minRating={minRating}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onRatingChange={handleRatingChange}
              onClearAll={clearAllFilters}
            />
          </div>
          
          {/* Right: Products grid */}
          <div className="lg:w-3/4">
            {/* Sort and product count header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <ProductSort 
                sortOption={sortOption}
                onSortChange={handleSortChange}
              />
              
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <div className="text-gray-600">
                  <span className="font-medium">{filteredProducts.length}</span> of{" "}
                  <span className="font-medium">{allProducts.length}</span> products
                </div>
                
                {/* Clear filters button (shows when filters are active) */}
                {(selectedCategories.length > 0 || priceRange || minRating > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
            
            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                    />
                  ))}
                </div>
                
                {/* Pagination - For now basic, we'll enhance later */}
                {filteredProducts.length > 9 && (
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
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products match your filters</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}