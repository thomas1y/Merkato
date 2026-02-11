'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { selectUser } from '@/app/lib/store/features/auth/selectors';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import { useToast } from '@/app/lib/hooks/useToast';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-1734523',
    date: '2024-12-15T10:30:00Z',
    status: 'Delivered',
    statusColor: 'green',
    total: 124.99,
    items: [
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 79.99,
        quantity: 1,
        image: '/images/headphones.jpg'
      },
      {
        id: 2,
        name: 'Phone Case',
        price: 24.99,
        quantity: 1,
        image: '/images/case.jpg'
      },
      {
        id: 3,
        name: 'Screen Protector',
        price: 19.99,
        quantity: 1,
        image: '/images/screen-protector.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card (•••• 4242)',
    trackingNumber: '1Z999AA10123456784',
    estimatedDelivery: '2024-12-18'
  },
  {
    id: 'ORD-1734524',
    date: '2024-12-10T14:45:00Z',
    status: 'Shipped',
    statusColor: 'blue',
    total: 79.98,
    items: [
      {
        id: 4,
        name: 'Smart Watch',
        price: 299.99,
        quantity: 1,
        image: '/images/watch.jpg'
      },
      {
        id: 5,
        name: 'Watch Band',
        price: 39.99,
        quantity: 1,
        image: '/images/watch-band.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    trackingNumber: '1Z999AA10123456785',
    estimatedDelivery: '2024-12-14'
  },
  {
    id: 'ORD-1734525',
    date: '2024-12-05T09:15:00Z',
    status: 'Processing',
    statusColor: 'yellow',
    total: 245.50,
    items: [
      {
        id: 6,
        name: 'Laptop Backpack',
        price: 89.99,
        quantity: 1,
        image: '/images/backpack.jpg'
      },
      {
        id: 7,
        name: 'Wireless Mouse',
        price: 34.99,
        quantity: 2,
        image: '/images/mouse.jpg'
      },
      {
        id: 8,
        name: 'Laptop Stand',
        price: 45.99,
        quantity: 1,
        image: '/images/stand.jpg'
      },
      {
        id: 9,
        name: 'USB-C Hub',
        price: 39.99,
        quantity: 1,
        image: '/images/hub.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card (•••• 1234)',
    trackingNumber: null,
    estimatedDelivery: '2024-12-12'
  },
  {
    id: 'ORD-1734526',
    date: '2024-11-28T16:20:00Z',
    status: 'Delivered',
    statusColor: 'green',
    total: 189.97,
    items: [
      {
        id: 10,
        name: 'Bluetooth Speaker',
        price: 129.99,
        quantity: 1,
        image: '/images/speaker.jpg'
      },
      {
        id: 11,
        name: 'Audio Cable',
        price: 14.99,
        quantity: 2,
        image: '/images/cable.jpg'
      },
      {
        id: 12,
        name: 'Wall Charger',
        price: 29.99,
        quantity: 1,
        image: '/images/charger.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card (•••• 4242)',
    trackingNumber: '1Z999AA10123456786',
    estimatedDelivery: '2024-12-02'
  },
  {
    id: 'ORD-1734527',
    date: '2024-11-20T11:10:00Z',
    status: 'Cancelled',
    statusColor: 'red',
    total: 54.98,
    items: [
      {
        id: 13,
        name: 'Phone Charger',
        price: 19.99,
        quantity: 2,
        image: '/images/charger.jpg'
      },
      {
        id: 14,
        name: 'USB Cable',
        price: 9.99,
        quantity: 1,
        image: '/images/usb-cable.jpg'
      },
      {
        id: 15,
        name: 'Car Mount',
        price: 24.99,
        quantity: 1,
        image: '/images/car-mount.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    trackingNumber: null,
    estimatedDelivery: null
  }
];

export default function OrdersPage() {
  const { toast } = useToast();
  const user = useSelector(selectUser);
  
  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All time');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  // Calculate order statistics
  const totalOrders = orders.length;
  const totalSpent = orders
    .filter(order => order.status !== 'Cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalSpent / (orders.filter(order => order.status !== 'Cancelled').length || 1);
  const ordersInTransit = orders.filter(order => 
    order.status === 'Shipped' || order.status === 'Processing'
  ).length;

  // Apply filters
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'All time') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch(dateFilter) {
        case 'Last 30 days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case 'Last 90 days':
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case '2024':
          cutoffDate = new Date('2024-01-01');
          break;
        case '2023':
          cutoffDate = new Date('2023-01-01');
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= new Date('2023-01-01') && orderDate < new Date('2024-01-01');
          });
          break;
        default:
          break;
      }
      
      if (dateFilter !== '2023') {
        filtered = filtered.filter(order => new Date(order.date) >= cutoffDate);
      }
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, orders]);

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleReorder = (order) => {
    toast.cart(`Items from order ${order.id} added to cart!`);
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'Cancelled', statusColor: 'red' }
            : order
        )
      );
      toast.info(`Order ${orderId} has been cancelled`);
    }
  };

  const handleTrackPackage = (trackingNumber) => {
    window.open(`https://www.fedex.com/tracking?tracknumber=${trackingNumber}`, '_blank');
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return '🟢';
      case 'Shipped': return '🔵';
      case 'Processing': return '🟡';
      case 'Cancelled': return '🔴';
      default: return '⚪';
    }
  };

  const getStatusBadgeColor = (status, statusColor) => {
    switch(status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600 mt-2">
                  View and track all your orders
                </p>
              </div>
              <Link 
                href="/profile" 
                className="mt-4 sm:mt-0 inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Profile
              </Link>
            </div>
          </div>

          {/* Order Statistics Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Order</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${averageOrderValue.toFixed(2)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{ordersInTransit}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="All time">All time</option>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 90 days">Last 90 days</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || statusFilter !== 'All' || dateFilter !== 'All time') && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="ml-2 hover:text-blue-600">
                      ×
                    </button>
                  </span>
                )}
                {statusFilter !== 'All' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('All')} className="ml-2 hover:text-blue-600">
                      ×
                    </button>
                  </span>
                )}
                {dateFilter !== 'All time' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Date: {dateFilter}
                    <button onClick={() => setDateFilter('All time')} className="ml-2 hover:text-blue-600">
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setDateFilter('All time');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.id}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(order.status, order.statusColor)}`}>
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Order Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(order.date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="text-sm font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Items</p>
                          <p className="text-sm font-medium text-gray-900">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Payment Method</p>
                          <p className="text-sm font-medium text-gray-900">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="flex items-center mt-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          {order.items.slice(0, 4).map((item, idx) => (
                            <div
                              key={idx}
                              className="inline-block w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                            >
                              {item.name.charAt(0)}
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="inline-block w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>
                        <span className="ml-3 text-xs text-gray-500">
                          {order.items.length} {order.items.length === 1 ? 'product' : 'products'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0 lg:ml-6">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        View Details
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {order.status === 'Delivered' && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Buy Again
                        </button>
                      )}

                      {order.status === 'Shipped' && order.trackingNumber && (
                        <button
                          onClick={() => handleTrackPackage(order.trackingNumber)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                          </svg>
                          Track Package
                        </button>
                      )}

                      {order.status === 'Processing' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'All' || dateFilter !== 'All time'
                    ? 'Try adjusting your filters'
                    : "You haven't placed any orders yet"}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Shopping →
                </Link>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredOrders.length > ordersPerPage && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastOrder, filteredOrders.length)}
                </span>{' '}
                of <span className="font-medium">{filteredOrders.length}</span> orders
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setShowDetailsModal(false)}
              ></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Order {selectedOrder.id}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Placed on {formatDate(selectedOrder.date)}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Order Status */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Order Status</p>
                        <div className="flex items-center mt-1">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadgeColor(selectedOrder.status, selectedOrder.statusColor)}`}>
                            {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                          </span>
                        </div>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tracking Number</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {selectedOrder.trackingNumber}
                          </p>
                        </div>
                      )}
                      {selectedOrder.estimatedDelivery && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Estimated Delivery</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {formatDate(selectedOrder.estimatedDelivery)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg font-bold text-gray-400">
                                {item.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4 flex-1">
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 pt-6 border-t">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium text-gray-900">
                              ${selectedOrder.total.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium text-gray-900">$5.99</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium text-gray-900">
                              ${(selectedOrder.total * 0.08).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-base font-semibold pt-2 border-t">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">
                              ${(selectedOrder.total + 5.99 + selectedOrder.total * 0.08).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedOrder.shippingAddress.address}<br />
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                            {selectedOrder.shippingAddress.country}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-3 text-sm font-medium text-gray-900">
                              {selectedOrder.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {selectedOrder.status === 'Delivered' && (
                          <button
                            onClick={() => {
                              handleReorder(selectedOrder);
                              setShowDetailsModal(false);
                            }}
                            className="w-full inline-flex justify-center items-center px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Buy Again
                          </button>
                        )}

                        {selectedOrder.status === 'Shipped' && selectedOrder.trackingNumber && (
                          <button
                            onClick={() => {
                              handleTrackPackage(selectedOrder.trackingNumber);
                            }}
                            className="w-full inline-flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                            Track Package
                          </button>
                        )}

                        <button
                          onClick={() => setShowDetailsModal(false)}
                          className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}