'use client';

import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-soft py-4 sticky top-0 z-50 border-b border-gray-100">
      <div className="container-max">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-dark hover-scale focus-ring rounded-lg px-2 py-1">
              HealthHive
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            <Link href="/" className="text-black hover:text-primary transition-all duration-200 font-medium px-4 py-3 rounded-lg hover:bg-primary-light focus-ring" style={{margin: '0 8px'}}>
              Home
            </Link>
            <Link href="/services" className="text-black hover:text-primary transition-all duration-200 font-medium px-4 py-3 rounded-lg hover:bg-primary-light focus-ring" style={{margin: '0 8px'}}>
              Services
            </Link>
            <Link href="/book" className="text-black hover:text-primary transition-all duration-200 font-medium px-4 py-3 rounded-lg hover:bg-primary-light focus-ring" style={{margin: '0 8px'}}>
              Book a Doctor
            </Link>
            <Link href="/about" className="text-black hover:text-primary transition-all duration-200 font-medium px-4 py-3 rounded-lg hover:bg-primary-light focus-ring" style={{margin: '0 8px'}}>
              About Us
            </Link>
            <Link href="/faqs" className="text-black hover:text-primary transition-all duration-200 font-medium px-4 py-3 rounded-lg hover:bg-primary-light focus-ring" style={{margin: '0 8px'}}>
              FAQs
            </Link>
            <Link href="/contact" className="text-black hover:text-primary transition-all duration-200 font-medium px-4 py-3 rounded-lg hover:bg-primary-light focus-ring" style={{margin: '0 8px'}}>
              Contact
            </Link>
          </nav>
          
          {/* Authentication Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link 
              href="/login" 
              className="btn-ghost focus-ring"
              style={{margin: '0 10px', padding: '12px 20px'}}
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="btn-primary hover-lift focus-ring"
              style={{margin: '0 10px', padding: '12px 20px'}}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-3 rounded-lg hover:bg-primary-light focus-ring transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-6 pb-6 border-t border-gray-100 animate-fade-in">
            <nav className="flex flex-col space-y-6 pt-8" style={{padding: '15px'}}>
              <Link 
                href="/" 
                className="text-black hover:text-primary transition-all duration-200 font-medium px-5 py-4 rounded-lg hover:bg-primary-light focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{margin: '8px 0'}}
              >
                Home
              </Link>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <Link 
                href="/services" 
                className="text-black hover:text-primary transition-all duration-200 font-medium px-5 py-4 rounded-lg hover:bg-primary-light focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{margin: '8px 0'}}
              >
                Services
              </Link>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <Link 
                href="/book" 
                className="text-black hover:text-primary transition-all duration-200 font-medium px-5 py-4 rounded-lg hover:bg-primary-light focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{margin: '8px 0'}}
              >
                Book a Doctor
              </Link>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <Link 
                href="/about" 
                className="text-black hover:text-primary transition-all duration-200 font-medium px-5 py-4 rounded-lg hover:bg-primary-light focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{margin: '8px 0'}}
              >
                About Us
              </Link>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <Link 
                href="/faqs" 
                className="text-black hover:text-primary transition-all duration-200 font-medium px-5 py-4 rounded-lg hover:bg-primary-light focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{margin: '8px 0'}}
              >
                FAQs
              </Link>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <Link 
                href="/contact" 
                className="text-black hover:text-primary transition-all duration-200 font-medium px-5 py-4 rounded-lg hover:bg-primary-light focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{margin: '8px 0'}}
              >
                Contact
              </Link>
              <div style={{clear: 'both', padding: '15px'}}></div>
              <div className="flex flex-col space-y-4 pt-8 px-6">
                <Link 
                  href="/login" 
                  className="btn-ghost text-center focus-ring"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{margin: '10px 0', padding: '15px'}}
                >
                  Login
                </Link>
                <div style={{clear: 'both', padding: '5px'}}></div>
                <Link 
                  href="/signup" 
                  className="btn-primary text-center focus-ring"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{margin: '10px 0', padding: '15px'}}
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 