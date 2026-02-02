

const ProductFilters = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
         {/* TITLE */}
      <div className="font-bold text-lg mb-6">
        Filters
      </div>

        {/* CATEGORY FILTER SECTION */}
        <div className="mb-8">
            <div className="font-semibold mb-4">Category</div>
            <div className="space-y-2">
                  <div>All</div>
                  <div>Electronics</div>
                  <div>Clothing</div>
                  <div>Home & Kitchen</div>
                  <div>Books</div>
                  <div>Sports</div>
            </div>
        </div>

        {/* PRICE FILTER SECTION */}
        <div className="mb-8">
            <div className="font-semibold mb-4">Price Range</div>
            <div className="space-y-2">
            {/* Price range items will go here */}
            <div>Under $50</div>
            <div>$50 - $100</div>
            <div>$100 - $200</div>
            <div>Over $200</div>
            </div>
        </div>
        {/* CLEAR FILTERS BUTTON */}
        <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded">
            Clear All Filters
        </button>
    </div>
  )
}

export default ProductFilters