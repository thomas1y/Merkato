import { NextResponse } from 'next/server';
import connectDB from '@/app/lib-backend/db/connect';
import Product from '@/app/lib-backend/db/models/Product';
import { getUserFromToken } from '@/app/lib-backend/middleware/auth';

// GET /api/products - Get all products with filters
export async function GET(request) {
  try {
    await connectDB();

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    // Filters
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const tags = searchParams.get('tags');
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    
    // Build filter object
    const filter = { status: 'active' }; // Only show active products by default
    
    // Add admin override to see all products (including drafts)
    const user = await getUserFromToken(request);
    const isAdmin = user?.role === 'admin';
    if (searchParams.get('includeAll') === 'true' && isAdmin) {
      delete filter.status;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (inStock === 'true') {
      filter.quantity = { $gt: 0 };
    }
    
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }
    
    // Build sort object
    let sort = {};
    if (search) {
      sort = { score: { $meta: 'textScore' } };
    } else {
      sort[sortBy] = sortOrder;
    }
    
    // Execute queries in parallel for better performance
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch products',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request) {
  try {
    await connectDB();
    
    // Check authentication and admin status
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Authentication required' 
        },
        { status: 401 }
      );
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Admin access required' 
        },
        { status: 403 }
      );
    }
    
    // Parse request body
    const productData = await request.json();
    
    // Add createdBy user
    productData.createdBy = user._id;
    
    // Generate SKU if not provided
    if (!productData.sku) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      productData.sku = `PRD-${timestamp}-${random}`;
    }
    
    // Create product
    const product = await Product.create(productData);
    
    // Fetch populated product for response
    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('createdBy', 'name email');
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation failed',
          errors 
        },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { 
          success: false,
          message: `${field} already exists`,
          field
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to create product',
        error: error.message 
      },
      { status: 500 }
    );
  }
}