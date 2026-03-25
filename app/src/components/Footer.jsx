/**
 * Footer Component
 * Simple footer with links and copyright
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-emerald-600 p-1.5 rounded-full">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Digital Employability
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Empowering rural youth with career opportunities, skill development, 
              and access to government schemes for a brighter future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-emerald-400 transition-colors">
                  Job Opportunities
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-emerald-400 transition-colors">
                  Government Schemes
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-emerald-400 transition-colors">
                  Career Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>support@digitalemployability.org</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Digital Employability Platform. All rights reserved.</p>
          <p className="mt-1">
            Made with ❤️ for Rural Youth Empowerment
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
