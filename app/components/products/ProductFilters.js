
"use client";

import { FiFilter } from "react-icons/fi";

const ProductFilters = ({
  selectedCategories = [],
  priceRange = "",
  minRating = 0,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onClearAll
}) => {
  const categories = [
    { id: "electronics", label: "Electronics", count: 8 },
    { id: "clothing", label: "Clothing", count: 6 },
    { id: "books", label: "Books", count: 5 },
    { id: "home", label: "Home & Kitchen", count: 7 },
    { id: "sports", label: "Sports & Outdoors", count: 4 },
    { id: "beauty", label: "Beauty", count: 3 }
  ];

  const priceRanges = [
    { id: "under50", label: "Under $50", range: "0-50" },
    { id: "50to100", label: "$50 - $100", range: "50-100" },
    { id: "100to200", label: "$100 - $200", range: "100-200" },
    { id: "over200", label: "Over $200", range: "200+" }
  ];

  const ratings = [
    { id: 4, label: "4 Stars & Up", stars: 4 },
    { id: 3, label: "3 Stars & Up", stars: 3 },
    { id: 2, label: "2 Stars & Up", stars: 2 },
    { id: 1, label: "1 Star & Up", stars: 1 }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FiFilter className="text-blue-600" />
          Filters
        </h2>
        <button
          onClick={onClearAll}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Clear all
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="font-medium text-gray-700 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`cat-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => onCategoryChange(category.id)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`cat-${category.id}`}
                  className="ml-3 text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  {category.label}
                </label>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.id} className="flex items-center">
              <input
                type="radio"
                id={`price-${range.id}`}
                name="priceRange"
                checked={priceRange === range.id}
                onChange={() => onPriceChange(range.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`price-${range.id}`}
                className="ml-3 text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-8">
        <h3 className="font-medium text-gray-700 mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div key={rating.id} className="flex items-center">
              <input
                type="radio"
                id={`rating-${rating.id}`}
                name="rating"
                checked={minRating === rating.id}
                onChange={() => onRatingChange(rating.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`rating-${rating.id}`}
                className="ml-3 text-gray-600 hover:text-gray-900 cursor-pointer flex items-center gap-1"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < rating.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm ml-1">& Up</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedCategories.length > 0 || priceRange || minRating > 0) && (
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-700 mb-3">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                <button
                  onClick={() => onCategoryChange(cat)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            ))}
            {priceRange && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full">
                {priceRanges.find(r => r.id === priceRange)?.label}
                <button
                  onClick={() => onPriceChange("")}
                  className="text-green-500 hover:text-green-700"
                >
                  ×
                </button>
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-sm px-3 py-1 rounded-full">
                {minRating}+ Stars
                <button
                  onClick={() => onRatingChange(0)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;