// File: app/products/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiShoppingCart, FiTruck, FiShield, FiArrowLeft } from "react-icons/fi";
import { getProductById, getRelatedProducts } from "@/app/lib/utils/mockData";
import ProductCard from "@/app/components/products/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (params.id) {
      const foundProduct = getProductById(params.id);
      setProduct(foundProduct);
      
      if (foundProduct) {
        const related = getRelatedProducts(params.id, foundProduct.category);
        setRelatedProducts(related);
        setSelectedImage(0);
      }
    }
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
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

  const handleAddToCart = () => {
    // TODO: Connect to Redux cart
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  {product.originalPrice && (
                    <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  {/* In real app: <Image src={product.images[selectedImage]} alt={product.name} fill /> */}
                  <div className="text-6xl text-gray-300">📷</div>
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3 overflow-x-auto py-2">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'} overflow-hidden bg-gray-100`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl text-gray-400">📷</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
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

            {/* Description */}
            <div className="mb-8">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 py-3 w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-colors ${product.inStock ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                {/* Buy Now Button */}
                <button
                  disabled={!product.inStock}
                  className={`px-8 py-3 rounded-lg font-semibold transition-colors ${product.inStock ? 'bg-gray-900 hover:bg-black text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiTruck className="w-5 h-5" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiShield className="w-5 h-5" />
                  <span>2-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5">↻</div>
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">Category:</span>{' '}
              <Link 
                href={`/products?category=${product.category}`}
                className="text-blue-600 hover:underline"
              >
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Link>
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
                <p className="text-gray-700 whitespace-pre-line">{product.longDescription || product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex py-3 border-b border-gray-100">
                    <div className="w-1/3 font-medium text-gray-700">{key}</div>
                    <div className="w-2/3 text-gray-600">{value}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">
                        Based on {product.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">2 weeks ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "Excellent product! Exceeded my expectations. The quality is outstanding and the customer service was very helpful."
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
                href={`/products?category=${product.category}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View all →
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