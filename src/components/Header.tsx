import Link from 'next/link';

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-end h-20 gap-8">
          {/* Minimal Navigation - Right Side Only */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/okc/feed" 
              className="text-white/90 font-medium transition-all hover:text-white"
            >
              Feed
            </Link>
            <Link 
              href="/okc/members" 
              className="text-white/90 font-medium transition-all hover:text-white"
            >
              Members
            </Link>
            <Link 
              href="/about" 
              className="text-white/90 font-medium transition-all hover:text-white"
            >
              About
            </Link>
            <Link 
              href="/waitlist" 
              className="px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold transition-all hover:bg-white/30 shadow-lg"
            >
              Join Waitlist
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-white hover:opacity-70">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
