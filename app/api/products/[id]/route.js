import { NextResponse } from 'next/server';
import connectDB from '@/app/lib-backend/db/connect';
import Product from '@/app/lib-backend/db/models/Product';
import { getUserFromToken } from '@/app/lib-backend/middleware/auth';

// GET /api/products/[id] - Get single product by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid product ID format' 
        },
        { status: 400 }
      );
    }
    
    // Get user for determining if we show drafts
    const user = await getUserFromToken(request);
    const isAdmin = user?.role === 'admin';
    
    // Build query
    const query = { _id: id };
    if (!isAdmin) {
      query.status = 'active'; // Non-admins can only see active products
    }
    
    // Find product with populated fields
    const product = await Product.findOne(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('relatedProducts', 'name price slug images')
      .populate({
        path: 'reviews.user',
        select: 'name avatar'
      })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .lean(); // Convert to plain JavaScript object for performance
    
    if (!product) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Product not found' 
        },
        { status: 404 }
      );
    }
    
    // Increment view count (don't await to not slow down response)
    Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
    
    // Get only approved reviews for non-admins
    if (!isAdmin && product.reviews) {
      product.reviews = product.reviews.filter(
        review => review.status === 'approved'
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch product',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update entire product (admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
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
    
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid product ID format' 
        },
        { status: 400 }
      );
    }
    
    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Product not found' 
        },
        { status: 404 }
      );
    }
    
    // Parse and validate update data
    const updateData = await request.json();
    
    // Add updatedBy user
    updateData.updatedBy = user._id;
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validations
      }
    )
      .populate('category', 'name slug')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    
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
        message: 'Failed to update product',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id] - Partially update product (admin only)
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
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
    
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid product ID format' 
        },
        { status: 400 }
      );
    }
    
    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Product not found' 
        },
        { status: 404 }
      );
    }
    
    // Parse update data (only fields to update)
    const updateData = await request.json();
    
    // Add updatedBy user
    updateData.updatedBy = user._id;
    
    // Update product (only provided fields)
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    )
      .populate('category', 'name slug')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update product',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
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
    
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid product ID format' 
        },
        { status: 400 }
      );
    }
    
    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Product not found' 
        },
        { status: 404 }
      );
    }
    
    // Soft delete or hard delete? Let's do soft delete by setting status to 'archived'
    // This preserves data integrity for existing orders
    await Product.findByIdAndUpdate(id, { 
      status: 'archived',
      updatedBy: user._id
    });
    
    // Alternative: Hard delete (uncomment if you want permanent deletion)
    // await Product.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to delete product',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// OPTIONS /api/products/[id] - Return allowed methods
export async function OPTIONS() {
  return NextResponse.json({
    methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  }, {
    headers: {
      'Allow': 'GET, PUT, PATCH, DELETE, OPTIONS'
    }
  });
}