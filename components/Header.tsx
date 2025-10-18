"use client";

import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b" style={{
      backgroundColor: 'rgba(48, 48, 48, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottomColor: 'rgba(0, 217, 165, 0.2)'
    }}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
              background: 'linear-gradient(to bottom right, #00D9A5, #00A87E)'
            }}>
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold" style={{
              background: 'linear-gradient(to right, #00D9A5, #00FFC6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              YANMASIN
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#anasayfa"
              className="text-gray-300 transition-colors font-medium"
              style={{ 
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#00D9A5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              Anasayfa
            </a>
            <a
              href="#harita"
              className="text-gray-300 transition-colors font-medium"
              onMouseEnter={(e) => e.currentTarget.style.color = '#00D9A5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              Harita
            </a>
            <a
              href="#hakkimizda"
              className="text-gray-300 transition-colors font-medium"
              onMouseEnter={(e) => e.currentTarget.style.color = '#00D9A5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              Hakkımızda
            </a>
            <a
              href="#iletisim"
              className="text-gray-300 transition-colors font-medium"
              onMouseEnter={(e) => e.currentTarget.style.color = '#00D9A5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              İletişim
            </a>
            <button className="text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105" style={{
              background: 'linear-gradient(to right, #00D9A5, #00A87E)',
              boxShadow: '0 2px 10px rgba(0, 217, 165, 0.3)'
            }}>
              Mobil Uygulama
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
            style={{ color: '#00D9A5' }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a
              href="#anasayfa"
              className="block text-gray-300 transition-colors font-medium"
              onMouseEnter={(e) => e.currentTarget.style.color = '#00D9A5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              Anasayfa
            </a>
            <a
              href="#harita"
              className="block text-gray-300 transition-colors font-medium"
              onMouseEnter={(e) => e.currentTarget.style.color = '#00D9A5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              Harita
            </a>
            <a
              href="#hakkimizda"
              className="block text-gray-300 transition-colors font-medium"
              onMouseEnter={(e) => e.currentTarget.style.color = '#00D9A5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              Hakkımızda
            </a>
            <a
              href="#iletisim"
              className="block text-gray-300 transition-colors font-medium"
              onMouseEnter={(e) => e.currentTarget.style.color = '#00D9A5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              İletişim
            </a>
            <button className="w-full text-white px-6 py-2 rounded-lg transition-all duration-300" style={{
              background: 'linear-gradient(to right, #00D9A5, #00A87E)',
              boxShadow: '0 2px 10px rgba(0, 217, 165, 0.3)'
            }}>
              Mobil Uygulama
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

