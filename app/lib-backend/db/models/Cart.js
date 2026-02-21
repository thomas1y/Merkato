import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    max: [100, 'Quantity cannot exceed 100']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  // Snapshot of product details at time of adding to cart
  // This protects against price changes after item is in cart
  snapshot: {
    name: String,
    image: String,
    sku: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Allow guest carts
    unique: true, // One cart per user
    sparse: true // Allows multiple null values for guest carts
  },
  sessionId: {
    type: String,
    required: false, // For guest users
    index: true
  },
  items: [cartItemSchema],
  coupon: {
    code: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    discountAmount: Number,
    appliedAt: Date
  },
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted', 'expired'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    lastActivity: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for finding carts
cartSchema.index({ user: 1, status: 1 });
cartSchema.index({ sessionId: 1, status: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for expired carts

// Virtual for subtotal (sum of items * price)
cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((count, item) => count + item.quantity, 0);
});

// Virtual for unique items count
cartSchema.virtual('uniqueItemsCount').get(function() {
  return this.items.length;
});

// Virtual for discount amount
cartSchema.virtual('discount').get(function() {
  if (!this.coupon) return 0;
  
  if (this.coupon.discountType === 'percentage') {
    return (this.subtotal * this.coupon.discountAmount) / 100;
  } else {
    return this.coupon.discountAmount;
  }
});

// Virtual for total after discount
cartSchema.virtual('total').get(function() {
  return this.subtotal - this.discount;
});

// Virtual for shipping (can be calculated based on items/address)
cartSchema.virtual('shipping').get(function() {
  // This would be calculated based on shipping rules
  // For now, return 0 or a fixed amount
  return this.subtotal > 100 ? 0 : 10;
});

// Virtual for grand total
cartSchema.virtual('grandTotal').get(function() {
  return this.total + this.shipping;
});

// Method to add item to cart
cartSchema.methods.addItem = async function(productId, quantity = 1, productData = null) {
  // Check if item already exists
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === productId.toString()
  );
  
  if (existingItemIndex > -1) {
    // Update quantity of existing item
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].updatedAt = new Date();
  } else {
    // Add new item
    if (!productData) {
      // Fetch product data if not provided
      const Product = mongoose.model('Product');
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      productData = {
        price: product.price,
        snapshot: {
          name: product.name,
          image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url,
          sku: product.sku
        }
      };
    }
    
    this.items.push({
      product: productId,
      quantity,
      price: productData.price,
      snapshot: productData.snapshot
    });
  }
  
  this.metadata.lastActivity = new Date();
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(
    item => item._id.toString() !== itemId.toString()
  );
  this.metadata.lastActivity = new Date();
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId, newQuantity) {
  const item = this.items.id(itemId);
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  if (newQuantity <= 0) {
    // Remove item if quantity is 0 or negative
    return this.removeItem(itemId);
  }
  
  item.quantity = newQuantity;
  item.updatedAt = new Date();
  this.metadata.lastActivity = new Date();
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.coupon = null;
  this.metadata.lastActivity = new Date();
  return this.save();
};

// Method to apply coupon
cartSchema.methods.applyCoupon = async function(couponCode) {
  // Here you would validate the coupon with a Coupon model
  // For now, we'll just set a placeholder
  const Coupon = mongoose.model('Coupon');
  const coupon = await Coupon.findOne({ 
    code: couponCode.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });
  
  if (!coupon) {
    throw new Error('Invalid or expired coupon');
  }
  
  // Check minimum purchase
  if (coupon.minPurchase && this.subtotal < coupon.minPurchase) {
    throw new Error(`Minimum purchase of $${coupon.minPurchase} required`);
  }
  
  this.coupon = {
    code: coupon.code,
    discountType: coupon.discountType,
    discountAmount: coupon.discountAmount,
    appliedAt: new Date()
  };
  
  return this.save();
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.coupon = null;
  return this.save();
};

// Method to check if cart is expired
cartSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Static method to get or create cart for user/session
cartSchema.statics.getOrCreateCart = async function({ userId, sessionId }) {
  let cart = null;
  
  if (userId) {
    // Try to find cart by user
    cart = await this.findOne({ user: userId, status: 'active' });
  } else if (sessionId) {
    // Try to find cart by session
    cart = await this.findOne({ sessionId, status: 'active' });
  }
  
  // If no cart exists, create one
  if (!cart) {
    const cartData = {};
    if (userId) cartData.user = userId;
    if (sessionId) cartData.sessionId = sessionId;
    
    cart = await this.create(cartData);
  }
  
  return cart;
};

// Static method to merge guest cart into user cart
cartSchema.statics.mergeCarts = async function(userId, sessionId) {
  // Find guest cart
  const guestCart = await this.findOne({ sessionId, status: 'active' });
  if (!guestCart || guestCart.items.length === 0) {
    return null;
  }
  
  // Find or create user cart
  let userCart = await this.findOne({ user: userId, status: 'active' });
  if (!userCart) {
    userCart = await this.create({ user: userId });
  }
  
  // Merge items (avoid duplicates, sum quantities)
  for (const guestItem of guestCart.items) {
    const existingItem = userCart.items.find(
      item => item.product.toString() === guestItem.product.toString()
    );
    
    if (existingItem) {
      existingItem.quantity += guestItem.quantity;
    } else {
      userCart.items.push({
        product: guestItem.product,
        quantity: guestItem.quantity,
        price: guestItem.price,
        snapshot: guestItem.snapshot
      });
    }
  }
  
  // Mark guest cart as converted
  guestCart.status = 'converted';
  await guestCart.save();
  
  // Save user cart
  userCart.metadata.lastActivity = new Date();
  return userCart.save();
};

// Pre-save middleware
cartSchema.pre('save', function(next) {
  // Update last activity
  this.metadata.lastActivity = new Date();
  
  // Update expiresAt based on status
  if (this.status === 'active') {
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Pre-remove middleware
cartSchema.pre('remove', async function(next) {
  // Any cleanup needed before cart is removed
  next();
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;