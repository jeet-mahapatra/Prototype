// Main layout component wrapper

import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, onAuthModalOpen }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAuthModalOpen={onAuthModalOpen} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
