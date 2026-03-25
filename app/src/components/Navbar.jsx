/**
 * Navbar Component
 * Navigation bar with responsive mobile menu
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  Briefcase, 
  FileText, 
  BookOpen, 
  Home, 
  LayoutDashboard,
  Shield,
  LogOut
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path) => {
    return location.pathname === path ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-700 hover:text-white';
  };

  // Navigation links for authenticated users
  const authLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/schemes', label: 'Schemes', icon: FileText },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  // Admin link
  if (isAdmin()) {
    authLinks.push({ path: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <nav className="bg-emerald-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-full">
              <Briefcase className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              Digital Employability
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)}`}
                  >
                    <span className="flex items-center space-x-1">
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </span>
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="ml-4 px-4 py-2 bg-white text-emerald-600 rounded-md text-sm font-medium hover:bg-emerald-50 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}
                >
                  <span className="flex items-center space-x-1">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="ml-4 px-4 py-2 bg-white text-emerald-600 rounded-md text-sm font-medium hover:bg-emerald-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-4 py-2 bg-emerald-700 text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:bg-emerald-700 p-2 rounded-md"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)}`}
                  >
                    <span className="flex items-center space-x-2">
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-emerald-100 hover:bg-emerald-600 hover:text-white"
                >
                  <span className="flex items-center space-x-2">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')}`}
                >
                  <span className="flex items-center space-x-2">
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </span>
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-emerald-100 hover:bg-emerald-600 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-emerald-100 hover:bg-emerald-600 hover:text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
