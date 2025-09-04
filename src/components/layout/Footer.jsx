// Footer component with information and links

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🏛️</span>
              <div>
                <h3 className="text-lg font-bold">Civic Connect</h3>
                <p className="text-sm text-gray-300">Government of Jharkhand</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              A digital platform enabling citizens to report civic issues directly to the government 
              and track their resolution. Working together to build a better Jharkhand.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#dashboard" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#report" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="#track" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Track Issues
                </a>
              </li>
              <li>
                <a href="#departments" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Departments
                </a>
              </li>
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Government
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://jharkhand.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Jharkhand Portal
                </a>
              </li>
              <li>
                <a 
                  href="https://india.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  India.gov.in
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 Government of Jharkhand. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-300 text-sm">
                For technical support: 
                <a href="mailto:support@civic.jharkhand.gov.in" className="text-blue-400 hover:text-blue-300 ml-1">
                  support@civic.jharkhand.gov.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-red-700 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center">
            <p className="text-white text-sm font-medium">
              🚨 Emergency: Police - 100 | Fire - 101 | Ambulance - 108
            </p>
            <p className="text-white text-sm mt-1 sm:mt-0">
              Helpline: 1800-XXX-XXXX (Toll Free)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
