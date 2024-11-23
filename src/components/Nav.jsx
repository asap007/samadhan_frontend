// components/Nav.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, BarChart, History, ShoppingBag, Lightbulb, FileText } from 'lucide-react';

const Nav = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const navigationItems = [
    { 
      name: 'Fintech Advisor', 
      key: 'dashboard', 
      icon: Lightbulb,
      path: '/financial-advisor'
    },
    { 
      name: 'Product Advisor', 
      key: 'history', 
      icon: ShoppingBag,
      path: '/suggestion-advisor'
    },
    {
        name: 'PDF Advisor',
        key: 'pdf',
        icon: FileText,
        path: '/pdf-advisor'
      }
  ];

  return (
    <nav className="w-full bg-white shadow-lg fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Zap className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-xl font-bold text-gray-800">FinWise</span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center">
            <div className="flex space-x-4">
              {navigationItems.map(({ name, key, icon: Icon, path }) => (
                <Link
                  key={key}
                  to={path}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${location.pathname === path
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;