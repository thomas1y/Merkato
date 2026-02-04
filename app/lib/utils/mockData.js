

// File: app/lib/utils/mockData.js
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
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    longDescription: "Experience premium sound quality with these noise-cancelling wireless headphones. Features include 30-hour battery life, quick charging (15 minutes for 3 hours of playback), memory foam ear cushions for all-day comfort, and foldable design for easy storage. Perfect for music lovers, travelers, and professionals.",
    price: 99.99,
    originalPrice: 129.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1518441902113-fdf07c19c9e0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518441902113-fdf07c19c9e0?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"
    ],
    stock: 50,
    rating: 4.5,
    reviews: 128,
    specifications: {
      "Battery Life": "30 hours",
      "Charging Time": "2 hours",
      "Connectivity": "Bluetooth 5.0",
      "Noise Cancellation": "Active",
      "Weight": "265g",
      "Warranty": "2 years"
    },
    features: [
      "Active noise cancellation",
      "30-hour battery life",
      "Memory foam ear cushions",
      "Foldable design",
      "Voice assistant support",
      "Quick charging"
    ]
  },
  {
    id: 2,
    name: "Classic Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt available in multiple colors.",
    longDescription: "Made from 100% premium combed cotton, this classic t-shirt offers exceptional softness and durability. Pre-shrunk fabric maintains shape wash after wash. Features ribbed crew neck, double-stitched hem, and shoulder-to-shoulder taping for extra durability.",
    price: 19.99,
    originalPrice: 24.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"
    ],
    stock: 100,
    rating: 4.2,
    reviews: 56,
    specifications: {
      "Material": "100% Cotton",
      "Fit": "Regular",
      "Care": "Machine wash cold",
      "Origin": "Made in USA",
      "Weight": "180 GSM"
    },
    features: [
      "Premium combed cotton",
      "Pre-shrunk fabric",
      "Double-stitched hem",
      "Ribbed crew neck",
      "Shoulder-to-shoulder taping"
    ]
  },
  {
    id: 3,
    name: "Smart Watch Series 5",
    description: "Advanced smartwatch with fitness tracking and heart rate monitor.",
    longDescription: "Stay connected and track your fitness with this advanced smartwatch. Features include heart rate monitoring, sleep tracking, GPS, water resistance up to 50m, and 7-day battery life. Compatible with both iOS and Android devices.",
    price: 249.99,
    originalPrice: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1434493650001-5d43a6fea0cc?w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3f5b32b3c05f?w=800&q=80"
    ],
    stock: 30,
    rating: 4.7,
    reviews: 89,
    specifications: {
      "Display": "1.78\" AMOLED",
      "Battery Life": "7 days",
      "Water Resistance": "50m",
      "Connectivity": "Bluetooth 5.2, Wi-Fi",
      "Sensors": "Heart rate, GPS, Accelerometer",
      "Compatibility": "iOS & Android"
    },
    features: [
      "Heart rate monitoring",
      "Sleep tracking",
      "GPS built-in",
      "Water resistant",
      "7-day battery",
      "Customizable watch faces"
    ]
  },
  {
    id: 4,
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 ceramic mugs with elegant design, microwave safe.",
    longDescription: "Elevate your coffee experience with this elegant set of 4 ceramic mugs. Each mug features a unique hand-painted design, is microwave and dishwasher safe, and has a comfortable handle for easy gripping.",
    price: 34.99,
    originalPrice: 39.99,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=800&q=80"
    ],
    stock: 75,
    rating: 4.3,
    reviews: 42,
    specifications: {
      "Material": "Premium Ceramic",
      "Capacity": "12 oz each",
      "Microwave Safe": "Yes",
      "Dishwasher Safe": "Yes",
      "Set Includes": "4 mugs",
      "Design": "Hand-painted"
    },
    features: [
      "Set of 4 mugs",
      "Microwave safe",
      "Dishwasher safe",
      "Hand-painted design",
      "Comfortable handle",
      "Elegant presentation box"
    ]
  },
  {
    id: 5,
    name: "JavaScript: The Definitive Guide",
    description: "Comprehensive guide to JavaScript programming, 7th edition.",
    longDescription: "The definitive guide to JavaScript programming, now in its 7th edition. Covers everything from basic syntax to advanced topics like async programming, modules, and web APIs. Perfect for both beginners and experienced developers.",
    price: 49.99,
    originalPrice: 59.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80"
    ],
    stock: 40,
    rating: 4.8,
    reviews: 203,
    specifications: {
      "Author": "David Flanagan",
      "Edition": "7th",
      "Pages": "1096",
      "Publisher": "O'Reilly Media",
      "ISBN": "978-1491952023",
      "Publication Date": "2020"
    },
    features: [
      "Comprehensive coverage",
      "Updated for ES2020",
      "Includes async/await",
      "Covers modules and classes",
      "Practical examples",
      "Reference appendix"
    ]
  },
  {
    id: 6,
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat with carrying strap, 6mm thickness.",
    longDescription: "Practice yoga comfortably with this premium non-slip mat. Made from eco-friendly TPE material, 6mm thickness provides cushioning for joints, and the textured surface ensures stability during poses. Includes carrying strap.",
    price: 29.99,
    originalPrice: 34.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80"
    ],
    stock: 60,
    rating: 4.4,
    reviews: 67,
    specifications: {
      "Material": "Eco-friendly TPE",
      "Thickness": "6mm",
      "Dimensions": "72\" x 24\"",
      "Weight": "4.5 lbs",
      "Includes": "Carrying strap",
      "Color": "Purple"
    },
    features: [
      "Non-slip surface",
      "Eco-friendly material",
      "6mm thickness",
      "Carrying strap included",
      "Easy to clean",
      "Sweat resistant"
    ]
  },
  {
    id: 7,
    name: "Laptop Backpack",
    description: "Water-resistant backpack with laptop compartment and USB port.",
    longDescription: "Carry your tech gear in style with this water-resistant backpack. Features dedicated laptop compartment (fits up to 15.6\" laptops), multiple organizational pockets, USB charging port, and comfortable padded straps.",
    price: 59.99,
    originalPrice: 69.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=800&q=80"
    ],
    stock: 45,
    rating: 4.6,
    reviews: 94,
    specifications: {
      "Material": "Water-resistant Polyester",
      "Laptop Size": "Up to 15.6\"",
      "Capacity": "25L",
      "USB Port": "Yes",
      "Weight": "2.2 lbs",
      "Color": "Black"
    },
    features: [
      "Water-resistant",
      "USB charging port",
      "Laptop compartment",
      "Multiple pockets",
      "Padded straps",
      "Organizer section"
    ]
  },
  {
    id: 8,
    name: "Stainless Steel Water Bottle",
    description: "1L insulated water bottle, keeps drinks cold for 24 hours.",
    longDescription: "Stay hydrated with this double-walled stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. Features a leak-proof lid, powder-coated finish, and fits in most cup holders.",
    price: 24.99,
    originalPrice: 29.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80"
    ],
    stock: 80,
    rating: 4.5,
    reviews: 121,
    specifications: {
      "Material": "Stainless Steel",
      "Capacity": "1 Liter",
      "Insulation": "Double-walled",
      "Cold Retention": "24 hours",
      "Hot Retention": "12 hours",
      "Lid Type": "Leak-proof"
    },
    features: [
      "Keeps cold 24h / hot 12h",
      "Double-walled insulation",
      "Leak-proof lid",
      "Fits cup holders",
      "Powder-coated finish",
      "BPA-free"
    ]
  }
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