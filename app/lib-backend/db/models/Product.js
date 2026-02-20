import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare at price cannot be negative'],
    default: null
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative'],
    select: false, // Hide from regular queries
    default: null
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true
  },
  barcode: {
    type: String,
    sparse: true,
    default: null
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [1, 'Low stock threshold must be at least 1']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  variants: [{
    name: String,
    sku: String,
    price: Number,
    quantity: Number,
    attributes: Map
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: String,
    comment: String,
    images: [String],
    verifiedPurchase: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ featured: 1, createdAt: -1 });
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ slug: 1 }, { unique: true });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    const discount = ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100;
    return Math.round(discount);
  }
  return 0;
});

// Virtual for inStock status
productSchema.virtual('inStock').get(function() {
  return this.quantity > 0;
});

// Virtual for lowStock status
productSchema.virtual('isLowStock').get(function() {
  return this.quantity > 0 && this.quantity <= this.lowStockThreshold;
});

// Pre-save middleware to create slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate average rating when reviews change
  if (this.isModified('reviews')) {
    const approvedReviews = this.reviews.filter(r => r.status === 'approved');
    if (approvedReviews.length > 0) {
      const sum = approvedReviews.reduce((acc, review) => acc + review.rating, 0);
      this.averageRating = sum / approvedReviews.length;
      this.numReviews = approvedReviews.length;
    } else {
      this.averageRating = 0;
      this.numReviews = 0;
    }
  }
  
  next();
});

// Method to check if product can be ordered
productSchema.methods.canOrder = function(quantity = 1) {
  return this.status === 'active' && this.quantity >= quantity;
};

// Method to reduce stock (called when order is placed)
productSchema.methods.reduceStock = async function(quantity) {
  if (this.quantity < quantity) {
    throw new Error('Insufficient stock');
  }
  this.quantity -= quantity;
  this.soldCount += quantity;
  return this.save();
};

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 10) {
  return this.find({ featured: true, status: 'active' })
    .populate('category', 'name slug')
    .limit(limit)
    .sort('-createdAt');
};

// Static method to search products
productSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    status: 'active',
    ...filters
  };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery)
    .populate('category', 'name slug')
    .sort(query ? { score: { $meta: 'textScore' } } : '-createdAt');
};

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;