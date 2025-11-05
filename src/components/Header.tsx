import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Name Only */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="font-bold text-xl text-gray-900">DealSprints</span>
            <span className="text-sm font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              OKC
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/okc/feed" 
              className="text-gray-700 font-medium transition-colors hover:opacity-70"
            >
              Feed
            </Link>
            <Link 
              href="/okc/members" 
              className="text-gray-700 font-medium transition-colors hover:opacity-70"
            >
              Members
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 font-medium transition-colors hover:opacity-70"
            >
              About
            </Link>
            <Link 
              href="/waitlist" 
              className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-lg font-semibold transition-opacity hover:opacity-90"
            >
              Join Waitlist
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-700 hover:opacity-70">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
