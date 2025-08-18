import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UserIcon, 
  LogOutIcon, 
  GraduationCapIcon,
  MenuIcon,
  XIcon,
  Briefcase,
  Home,
  Users,
  FileText,
  LogInIcon,
  UserPlusIcon
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: isAdmin ? '/admin' : '/dashboard', icon: <Home className="h-5 w-5" />, text: 'Home' },
    // { to: '/admin/visits', icon: <Briefcase className="h-5 w-5" />, text: 'Jobs' },
    // { to: '/companies', icon: <Users className="h-5 w-5" />, text: 'Companies' },
    // { to: '/applications', icon: <FileText className="h-5 w-5" />, text: 'Applications' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              to="/home" 
              className="flex items-center space-x-2 group"
            >
              <GraduationCapIcon className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              <span className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                Placement<span className="text-indigo-600">Portal</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <div className="flex space-x-4">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.to}
                      className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-indigo-50"
                    >
                      {link.icon}
                      <span className="text-sm font-medium">{link.text}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2 bg-indigo-50 rounded-full px-3 py-1">
                    <UserIcon className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-800">{user.username}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      isAdmin 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isAdmin ? 'Admin' : 'Student'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors group"
                  >
                    <LogOutIcon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-md hover:bg-indigo-50"
                >
                  <LogInIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-1.5 rounded-md shadow-sm"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-4 pt-2 pb-4 space-y-2 border-t border-gray-100">
            {user ? (
              <>
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors px-3 py-2 rounded-md"
                    >
                      {link.icon}
                      <span className="text-sm font-medium">{link.text}</span>
                    </Link>
                  ))}
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-indigo-50 rounded-md">
                    <UserIcon className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.username}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isAdmin 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isAdmin ? 'Admin' : 'Student'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <LogOutIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors px-3 py-2 rounded-md"
                >
                  <LogInIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-3 py-2 rounded-md justify-center"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;