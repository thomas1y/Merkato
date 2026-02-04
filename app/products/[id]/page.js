// File: app/products/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiStar, FiShoppingCart, FiTruck, FiShield, FiArrowLeft, FiCheck } from "react-icons/fi";
import ProductCard from "@/app/components/products/ProductCard";
import { getProductById, getRelatedProducts } from "@/app/lib/utils/mockData";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (params.id) {
      const foundProduct = getProductById(params.id);
      setProduct(foundProduct);
      
      if (foundProduct) {
        const related = getRelatedProducts(foundProduct.category, params.id);
        setRelatedProducts(related);
        setSelectedImage(0);
      }
    }
  }, [params.id]);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    // Simulate API call
    setTimeout(() => {
      alert(`Added ${quantity} ${product.name}(s) to cart! Total: $${(product.price * quantity).toFixed(2)}`);
      setIsAddingToCart(false);
    }, 500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // In real app, this would redirect to checkout
    // router.push('/checkout');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-gray-400">😕</div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiArrowLeft />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                {product.images && product.images[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={`${product.name} - View ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <div className="text-6xl mb-4">📷</div>
                      <p>No image available</p>
                    </div>
                  </div>
                )}
                
                {/* Discount Badge */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto py-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information */}
          <div>
            {/* Product Title and Category */}
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Rating and Stock Status */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.stock > 0 ? (
                    <span className="flex items-center">
                      <FiCheck className="mr-1" /> In Stock
                    </span>
                  ) : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">Tax included. Shipping calculated at checkout.</p>
            </div>

            {/* Short Description */}
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    disabled={product.stock <= 0}
                  >
                    −
                  </button>
                  <span className="px-4 py-3 w-16 text-center font-medium bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    disabled={product.stock <= 0}
                  >
                    +
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || isAddingToCart}
                    className={`flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-colors ${product.stock > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    {isAddingToCart ? 'Adding...' : (product.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className={`px-8 py-3 rounded-lg font-semibold transition-colors ${product.stock > 0 ? 'bg-gray-900 hover:bg-black text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Stock Information */}
              <div className="text-sm text-gray-600 mb-4">
                {product.stock > 0 ? (
                  <p>
                    <span className="font-medium">{product.stock}</span> items available
                    {quantity > product.stock && (
                      <span className="text-red-600 ml-2">(Maximum {product.stock} per order)</span>
                    )}
                  </p>
                ) : (
                  <p className="text-red-600">This item is currently out of stock</p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiTruck className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiShield className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">2-Year Warranty</p>
                    <p className="text-xs text-gray-500">Hassle-free returns</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 flex items-center justify-center text-orange-500">↻</div>
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-xs text-gray-500">Money-back guarantee</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <span className="font-medium">Category:</span>{' '}
                <Link 
                  href={`/products?category=${product.category.toLowerCase().replace(' & ', '-')}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {product.category}
                </Link>
              </p>
              {product.specifications && product.specifications["Origin"] && (
                <p>
                  <span className="font-medium">Origin:</span>{' '}
                  {product.specifications["Origin"]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {product.longDescription || product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 md:w-1/3 font-medium text-gray-700">{key}</div>
                    <div className="w-1/2 md:w-2/3 text-gray-600">{value}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">
                        Based on {product.reviews} reviews
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Write a Review
                  </button>
                </div>
                
                {/* Sample Review */}
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        JD
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium">John Doe</h4>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            <FiStar className="w-4 h-4 fill-current" />
                            <FiStar className="w-4 h-4 fill-current" />
                            <FiStar className="w-4 h-4 fill-current" />
                            <FiStar className="w-4 h-4 fill-current" />
                            <FiStar className="w-4 h-4 fill-current" />
                          </div>
                          <span className="text-sm text-gray-500 ml-2">2 weeks ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "Excellent product! Exceeded my expectations. The quality is outstanding and the customer service was very helpful. Would definitely recommend to others."
                  </p>
                </div>
                
                <button className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
              <Link
                href={`/products?category=${product.category.toLowerCase().replace(' & ', '-')}`}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                View all in {product.category} →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}