'use client';

import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function WelcomeContent() {
  return (
    <>
      <Header />
      
      <div className="max-w-2xl mx-auto px-6 py-24">
        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to DealSprints OKC Pro!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your payment was successful. You now have unlimited access to all OKC development news.
          </p>

          {/* Next Steps */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-gray-900">Check Your Email</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              We've sent you a magic link to log in. Click the link in your email to:
            </p>
            <ul className="text-gray-700 text-sm space-y-2 ml-6">
              <li>• Log in instantly (no password needed)</li>
              <li>• Access unlimited posts</li>
              <li>• Set up a password for easier login next time (optional)</li>
              <li>• Manage your subscription from your dashboard</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Link
              href="/okc/feed"
              className="block w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                Browse Feed Now
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>

            <Link
              href="/login"
              className="block w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all text-center"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Support */}
          <p className="text-sm text-gray-500 mt-8">
            Didn't receive the email? Check your spam folder or{' '}
            <Link href="/auth/forgot-password" className="text-purple-600 hover:text-purple-700 underline">
              request a new magic link
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <WelcomeContent />
      </Suspense>
    </main>
  );
}
