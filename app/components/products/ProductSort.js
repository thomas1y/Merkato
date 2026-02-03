
"use client";

import { FiFilter } from "react-icons/fi";

const ProductSort = ({ sortOption, onSortChange }) => {
  const sortOptions = [
    { id: "featured", label: "Featured" },
    { id: "priceLowHigh", label: "Price: Low to High" },
    { id: "priceHighLow", label: "Price: High to Low" },
    { id: "rating", label: "Customer Rating" },
  ];

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center text-gray-700">
        <FiFilter className="mr-2 text-gray-500" />
        <span className="font-medium">Sort by:</span>
      </div>

      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductSort;
