'use client';

import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  selectCartTotalQuantity 
} from '@/app/lib/store/features/cart/selectors';
import { 
  selectIsAuthenticated, 
  selectUser, 
  selectUserFirstName,
  selectUserGreeting 
} from '@/app/lib/store/features/auth/selectors';
import { logout } from '@/app/lib/store/features/auth/authSlice';
import { FiShoppingCart, FiSearch, FiUser, FiChevronDown } from 'react-icons/fi';
import { useToast } from '@/app/lib/hooks/useToast';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const userFirstName = useSelector(selectUserFirstName);
  const greeting = useSelector(selectUserGreeting);
  
  const [mounted, setMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/');
    toast.success('Logged out successfully');
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!mounted) return null;

  return (
    <header className="sticky bg-white border-b top-0 w-full z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          
          {/* LOGO SECTION - Left side */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              merkato
            </Link>
          </div>

          {/* SEARCH BAR - Center */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600">
                Search
              </button>
            </div>
          </div>

          {/* NAVIGATION & USER - Right side */}
          <div className="flex items-center space-x-6">
            
            {/* DESKTOP NAVIGATION LINKS */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                About
              </Link>
            </nav>

            {/* CART ICON with badge */}
            <Link 
              href="/cart" 
              className="relative text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FiShoppingCart className="w-6 h-6" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </Link>
           
            {/* USER MENU - Authenticated vs Guest */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  {/* Authenticated User Button */}
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {userFirstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {userFirstName || 'Account'}
                    </span>
                    <FiChevronDown className={`hidden md:block w-4 h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{greeting}</p>
                        <p className="text-xs text-gray-600 mt-1 truncate">{user?.email}</p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiUser className="w-4 h-4 mr-3" />
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Wishlist
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Guest User Button */}
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition group"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      Login
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden flex items-center p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slideDown">
            <div className="flex flex-col space-y-3">
              {/* Mobile Navigation Links */}
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="border-t border-gray-100 my-2"></div>
              
              {/* Mobile Cart */}
              <Link 
                href="/cart" 
                className="flex items-center justify-between text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Shopping Cart</span>
                {totalQuantity > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </Link>
              
              {/* Mobile User Links */}
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/profile" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    href="/orders" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-blue-600 hover:text-blue-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;