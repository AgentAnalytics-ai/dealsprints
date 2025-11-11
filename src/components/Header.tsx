'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  
  return (
    <header className={`${isHomepage ? 'absolute bg-transparent' : 'relative bg-white border-b border-gray-200'} top-0 left-0 right-0 z-50`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-end h-20 gap-8">
          {/* Minimal Navigation - Right Side Only */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/okc/feed" 
              className={`${isHomepage ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-all`}
            >
              Feed
            </Link>
            <Link 
              href="/pricing" 
              className={`${isHomepage ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-all`}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className={`${isHomepage ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-all`}
            >
              About
            </Link>
            <Link 
              href={isHomepage ? "/signup" : "/dashboard"}
              className={`px-5 py-2.5 ${isHomepage ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'} backdrop-blur-md border rounded-full font-semibold transition-all shadow-lg`}
            >
              {isHomepage ? 'Get Started' : 'Dashboard'}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className={`md:hidden p-2 ${isHomepage ? 'text-white' : 'text-gray-700'} hover:opacity-70`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
