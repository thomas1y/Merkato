

export const categories = [
  { id: 1, name: 'All', icon: '🛒' },
  { id: 2, name: 'Electronics', icon: '📱' },
  { id: 3, name: 'Clothing', icon: '👕' },
  { id: 4, name: 'Home & Kitchen', icon: '🏠' },
  { id: 5, name: 'Books', icon: '📚' },
  { id: 6, name: 'Sports', icon: '⚽' },
];

export const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 99.99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1518441902113-fdf07c19c9e0?w=800&q=80",
    stock: 50,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Classic Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt available in multiple colors.",
    price: 19.99,
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    stock: 100,
    rating: 4.2,
    reviews: 56,
  },
  {
    id: 3,
    name: "Smart Watch Series 5",
    description:
      "Advanced smartwatch with fitness tracking and heart rate monitor.",
    price: 249.99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    stock: 30,
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 4,
    name: "Ceramic Coffee Mug Set",
    description:
      "Set of 4 ceramic mugs with elegant design, microwave safe.",
    price: 34.99,
    category: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80",
    stock: 75,
    rating: 4.3,
    reviews: 42,
  },
  {
    id: 5,
    name: "JavaScript: The Definitive Guide",
    description:
      "Comprehensive guide to JavaScript programming, 7th edition.",
    price: 49.99,
    category: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    stock: 40,
    rating: 4.8,
    reviews: 203,
  },
  {
    id: 6,
    name: "Yoga Mat Premium",
    description:
      "Non-slip yoga mat with carrying strap, 6mm thickness.",
    price: 29.99,
    category: "Sports",
    image:
      "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=800&q=80",
    stock: 60,
    rating: 4.4,
    reviews: 67,
  },
  {
    id: 7,
    name: "Laptop Backpack",
    description:
      "Water-resistant backpack with laptop compartment and USB port.",
    price: 59.99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=800&q=80",
    stock: 45,
    rating: 4.6,
    reviews: 94,
  },
  {
    id: 8,
    name: "Stainless Steel Water Bottle",
    description:
      "1L insulated water bottle, keeps drinks cold for 24 hours.",
    price: 24.99,
    category: "Sports",
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80",
    stock: 80,
    rating: 4.5,
    reviews: 121,
  },
];
// Get product by ID
export const getProductById = (id) => {
  return products.find((product) => product.id === Number(id));
};

// Get related products (same category, exclude current)
export const getRelatedProducts = (category, currentId, limit = 4) => {
  return products
    .filter(
      (product) =>
        product.category === category && product.id !== Number(currentId)
    )
    .slice(0, limit);
};



export const featuredProducts = products.slice(0, 4); 