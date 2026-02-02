

const ProductSort = () => {
  return (
    <div className="flex items-center space-x-2">
         {/* LABEL */}
      <span className="text-gray-600">
        Sort by:
      </span>
      {/* DROPDOWN SELECT */}

      <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name: A to Z</option>
      </select>
    </div>
  )
}

export default ProductSort