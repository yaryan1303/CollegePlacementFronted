import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FacebookIcon, 
  TwitterIcon, 
  LinkedinIcon, 
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-white">
                Placement<span className="text-indigo-400">Portal</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Connecting students with top employers for successful career placements.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Job Listings
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPinIcon className="h-5 w-5 text-indigo-400 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 University Ave, Campus Town, CT 12345
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <MailIcon className="h-5 w-5 text-indigo-400" />
                <span className="text-gray-400 text-sm">
                  placement@university.edu
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-indigo-400" />
                <span className="text-gray-400 text-sm">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-indigo-400" />
                <span className="text-gray-400 text-sm">
                  Mon-Fri: 9AM - 5PM
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get updates on new job postings and placement opportunities.
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PlacementPortal. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/faq" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;