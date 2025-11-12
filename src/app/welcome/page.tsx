'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Try to get email from URL params or session
    const checkSession = async () => {
      // You could optionally verify the Stripe session here
      // For now, just show success message
    };
    checkSession();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
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
              We've sent you a login link to access your account. Click the link in the email to:
            </p>
            <ul className="text-gray-700 text-sm space-y-2 ml-6">
              <li>• Set up your password (optional)</li>
              <li>• Access unlimited posts</li>
              <li>• Manage your subscription</li>
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
              className="block w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Support */}
          <p className="text-sm text-gray-500 mt-8">
            Didn't receive the email? Check your spam folder or{' '}
            <Link href="/contact" className="text-purple-600 hover:text-purple-700 underline">
              contact support
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

